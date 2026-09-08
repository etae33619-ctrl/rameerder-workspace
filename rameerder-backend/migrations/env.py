import sys
import os
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
from sqlmodel import SQLModel

# Explicitly add the backend project root to the Python path
sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    ),
)

# Import application settings and models for metadata
from app.core.config import settings
from app.models import *

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Provide SQLModel's metadata to Alembic
target_metadata = SQLModel.metadata


def normalize_database_url(url: str) -> str:
    """
    Ensure PostgreSQL uses the asyncpg driver.

    Render may provide:
        postgresql://...

    Local development may provide:
        postgresql+asyncpg://...

    SQLAlchemy async migrations require:
        postgresql+asyncpg://...
    """
    if url.startswith("postgres://"):
        return url.replace(
            "postgres://",
            "postgresql+asyncpg://",
            1,
        )

    if url.startswith("postgresql://"):
        return url.replace(
            "postgresql://",
            "postgresql+asyncpg://",
            1,
        )

    return url


def run_migrations_offline() -> None:
    url = normalize_database_url(settings.DATABASE_URL)

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    # Normalize Render's PostgreSQL URL so SQLAlchemy uses asyncpg.
    database_url = normalize_database_url(settings.DATABASE_URL)

    # Inject the normalized connection string into Alembic.
    config.set_main_option(
        "sqlalchemy.url",
        database_url,
    )

    connectable = async_engine_from_config(
        config.get_section(
            config.config_ini_section,
            {},
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
