export class AppError extends Error {
  public statusCode: number
  public status: 'fail' | 'error'
  public isOperational: boolean

  public data?: any

  constructor(message: string, statusCode: number, data?: any) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.data = data

    Object.setPrototypeOf(this, AppError.prototype)
  }
}
