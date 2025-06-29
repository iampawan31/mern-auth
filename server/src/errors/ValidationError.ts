import { AppError } from './AppError'

export class ValidationError extends AppError {
  constructor(message = 'Missing fields!!', data?: any) {
    super(message, 422, data)
  }
}
