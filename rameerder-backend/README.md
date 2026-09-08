# RAMEERDER PACE GROUP Backend API

Production-ready backend for the Rameerder Pace Group E-Commerce and Logistics Platform.

## Technology Stack
- Python 3.x
- FastAPI
- PostgreSQL (via SQLModel)
- Alembic
- Pytest

## Development

1. Create virtual environment: `python -m venv venv`
2. Activate environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Setup environment: `cp .env.example .env`
5. Run server: `uvicorn app.main:app --reload`