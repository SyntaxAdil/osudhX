import type { Response } from "express";

interface ApiResponseOptions<T> {
  statusCode?: number;
  message: string;
  data?: T;
  meta?: object;
}


const sendResponse = <T>(res: Response, options: ApiResponseOptions<T>): Response => {
  const { statusCode = 200, message, data = null, meta } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};

export default sendResponse;