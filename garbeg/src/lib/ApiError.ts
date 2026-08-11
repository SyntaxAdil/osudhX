/**
 * Custom error class used to attach an HTTP status code to thrown errors.
 * Consumed by `asyncHandler`, which reads `statusCode` off the error to
 * build a consistent error response.
 */
class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
