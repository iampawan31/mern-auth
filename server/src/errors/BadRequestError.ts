import { AppError } from './AppError'

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', data?: any) {
    super(message, 400, data)
  }
}
