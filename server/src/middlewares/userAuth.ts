import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import environmentConfig from '../config/environmentTokens'
import { MyTokenPayload } from '../types/jwtPayload'

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
    next(error)
  }
}

export default userAuth
