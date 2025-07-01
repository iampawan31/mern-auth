// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack) // Log the full error stack for debugging

  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'local' && { stack: err.stack }),
      ...(err.data && { data: err.data })
    })
  } else {
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong!',
      ...(process.env.NODE_ENV === 'local' && { stack: err.stack })
    })
  }
}
