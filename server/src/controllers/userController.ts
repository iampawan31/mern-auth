import { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../errors/BadRequestError'
import userModel from '../models/userModel'

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body

    const user = await userModel.findById(userId)

    if (!user) {
      return next(new BadRequestError('User not found!!'))
    }

    return res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      },
      message: 'user data fetched successful!'
    })
  } catch (error) {
    next(error)
  }
}
