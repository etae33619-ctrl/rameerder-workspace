from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Centralized handler for all standard HTTP exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Exception",
            "message": exc.detail
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Centralized handler for Pydantic validation errors,
    formatting them so the React frontend can easily map field errors.
    """
    errors = []
    for error in exc.errors():
        field = ".".join([str(loc) for loc in error.get("loc", [])])
        message = error.get("msg")
        errors.append({"field": field, "message": message})

    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "message": "The submitted data is invalid.",
            "details": errors
        },
    )