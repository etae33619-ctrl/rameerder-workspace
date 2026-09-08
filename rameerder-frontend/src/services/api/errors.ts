export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromResponse(status: number, data: any): ApiError {
    let message = "An unexpected error occurred.";

    switch (status) {
      case 400:
        message = data?.detail || "Bad Request. Please verify your submitted data.";
        break;
      case 401:
        message = data?.detail || "Session expired or unauthorized. Please log in again.";
        break;
      case 403:
        message = data?.detail || "Access Forbidden. You lack permission for this operation.";
        break;
      case 404:
        message = data?.detail || "The requested resource could not be found.";
        break;
      case 409:
        message = data?.detail || "Conflict. An entity with this identifier already exists.";
        break;
      case 422:
        if (Array.isArray(data?.detail)) {
          const firstErr = data.detail[0] as ValidationErrorDetail;
          const field = firstErr.loc?.slice(1).join(".") || "field";
          message = `Validation Error: ${firstErr.msg} (${field})`;
        } else {
          message = data?.detail || "Unprocessable Entity. Data validation failed.";
        }
        break;
      case 429:
        message = "Too Many Requests. Rate limit reached, please try again later.";
        break;
      case 500:
        message = "Internal Server Error. The server encountered an issue.";
        break;
      default:
        message = data?.detail || data?.message || `Error status code: ${status}`;
    }

    return new ApiError(status, message, data?.detail);
  }

  static networkError(originalError?: unknown): ApiError {
    return new ApiError(0, "Network connection error. Please verify the FastAPI server is reachable.", originalError);
  }
}