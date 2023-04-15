import createHttpError from 'http-errors';
import { ErrorRequestHandler, NextFunction, Response, Request } from 'express';
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export const notFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(createHttpError(404, 'Not Found'));
};
