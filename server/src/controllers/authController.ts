import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel'
import transporter from '../config/nodemailer'
import { NextFunction, Request, Response } from 'express'
import environmentConfig from '../config/environmentTokens'
import environmentMailConfig from '../config/mailConfig'
import { BadRequestError } from '../errors/BadRequestError'
import { ValidationError } from '../errors/ValidationError'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return next(new ValidationError())
  }

  try {
    const isExistingUser = await userModel.findOne({ email })

    if (isExistingUser) {
      return next(new BadRequestError('Email already exists!!'))
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new userModel({ email, name, password: hashedPassword })

    await user.save()

    const token = jwt.sign({ id: user._id }, environmentConfig.jwtSecret, {
      expiresIn: '7d'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Sending welcome email
    const mailOptions = {
      from: environmentMailConfig.senderMail,
      to: user.email,
      subject: 'Welcome to MERN Auth',
      text: `Welcome to MERN Auth. Your account has been create with email id: ${user.email}`
    }

    await transporter.sendMail(mailOptions)

    return res.json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ValidationError('Email/Password is required!!'))
  }

  try {
    const user = await userModel.findOne({ email })

    if (!user) {
      return next(new BadRequestError('Email does not exist!!'))
    }

    const matchPassword = bcrypt.compare(password, user.password)

    if (!matchPassword) {
      return next(new BadRequestError('Email/Password does not match!!'))
    }

    const token = jwt.sign({ id: user._id }, environmentConfig.jwtSecret, {
      expiresIn: '7d'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    })

    return res.json({
      success: true,
      message: 'Logout successful!!'
    })
  } catch (error) {
    next(error)
  }
}

export const sendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body

    const user = await userModel.findById(userId)

    if (user.isVerified) {
      return next(new BadRequestError('User already verified!!'))
    }

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000))

    user.verificationCode = verificationCode

    // Verification Code expires in 20 Minutes
    user.verificationCodeExpiresAt = Date.now() + 20 * 60 * 1000
    await user.save()

    // Sending welcome email
    const mailOptions = {
      from: environmentMailConfig.senderMail,
      to: user.email,
      subject: 'Verify your account',
      text: `Your verification code is ${user.verificationCode}. Verify your account using this code.`
    }

    await transporter.sendMail(mailOptions)

    return res.json({
      success: true,
      message: 'Verification code sent successfully!!'
    })
  } catch (error) {
    next(error)
  }
}

// Verify email using verification code
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, verificationCode } = req.body

    if (!userId || !verificationCode) {
      return next(new ValidationError())
    }

    const user = await userModel.findById(userId)

    if (!user) {
      return next(new BadRequestError('User not found!!'))
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCode === ''
    ) {
      return next(new BadRequestError('Invalid verification code!!'))
    }

    if (user.verificationCodeExpiresAt < Date.now()) {
      return next(new BadRequestError('Verification code expired!!'))
    }

    user.isVerified = true
    user.verificationCode = ''
    user.verificationCodeExpiresAt = 0

    await user.save()

    return res.json({
      success: true,
      message: 'Email verified successfully!!'
    })
  } catch (error) {
    next(error)
  }
}

// Check if user is authenticated
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({
      success: true,
      message: null
    })
  } catch (error) {
    next(error)
  }
}

// Send Password reset verification code
export const sendPasswordResetVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new ValidationError('Email field is required!'))
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return next(new BadRequestError('Email is not registered!'))
    }

    const resetPasswordCode = String(
      Math.floor(100000 + Math.random() * 900000)
    )

    user.resetPasswordCode = resetPasswordCode

    // Verification Code expires in 20 Minutes
    user.resetPasswordCodeExpiresAt = Date.now() + 20 * 60 * 1000
    await user.save()

    // Sending reset password email
    const mailOptions = {
      from: environmentMailConfig.senderMail,
      to: user.email,
      subject: 'Reset your password',
      text: `Your reset password code is ${user.resetPasswordCode}. Reset your password using this code.`
    }

    await transporter.sendMail(mailOptions)

    return res.json({
      success: true,
      message: 'Password reset code sent to your email!'
    })
  } catch (error) {
    next(error)
  }
}

// Reset password using code
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword, resetPasswordCode } = req.body

    if (!email || newPassword || resetPasswordCode) {
      return next(new ValidationError('Email/Password/Reset Code is required!'))
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return next(new BadRequestError('Email is not registered!'))
    }

    if (
      user.resetPasswordCode === '' ||
      user.resetPasswordCode !== resetPasswordCode
    ) {
      return next(new BadRequestError('Invalid Reset code!'))
    }

    if (user.resetPasswordCodeExpiresAt < Date.now()) {
      return next(new BadRequestError('Reset code is expired!'))
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword

    user.resetPasswordCode = ''
    user.resetPasswordCodeExpiresAt = ''

    await user.save()

    return res.json({
      success: true,
      message: 'Password updated successfully!'
    })
  } catch (error) {
    next(error)
  }
}
