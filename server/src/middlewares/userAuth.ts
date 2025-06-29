import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import environmentConfig from '../config/environmentTokens'
import { MyTokenPayload } from '../types/jwtPayload'
import { AppError } from '../errors/AppError'

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access!!'
      })
    }

    const decodedToken = jwt.verify(
      token,
      environmentConfig.jwtSecret
    ) as MyTokenPayload

    if (decodedToken.id) {
      req.body.userId = decodedToken.id
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access!!'
      })
    }

    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new AppError('Your token has expired! Please log in again.', 401)
      )
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token! Please log in again.', 401))
    }

    next(
      new AppError(
        'Authentication failed due to an unexpected server error.',
        500
      )
    )
  }
}

export default userAuth
