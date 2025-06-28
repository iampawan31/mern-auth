import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'

export const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(422).json({
      success: false,
      message: 'Missing input fields!!'
    })
  }

  try {
    const isExistingUser = await userModel.findOne({ email })

    if (isExistingUser) {
      return res.status(422).json({
        success: false,
        message: 'Email already exists!!'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new userModel({ email, name, password: hashedPassword })

    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: 'Welcome to MERN Auth',
      text: `Welcome to MERN Auth. Your account has been create with email id: ${user.email}`
    }

    await transporter.sendMail(mailOptions)

    return res.json({
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: 'Email/Password is required!!'
    })
  }

  try {
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(422).json({
        success: false,
        message: 'Email does not exist!!'
      })
    }

    const matchPassword = bcrypt.compare(password, user.password)

    if (!matchPassword) {
      return res.status(422).json({
        success: false,
        message: 'Email/Password does not match!!'
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const logout = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const sendVerificationCode = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await userModel.findById(userId)

    if (user.isVerified) {
      return res.status(500).json({
        success: false,
        message: 'User already verified!!'
      })
    }

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000))

    user.verificationCode = verificationCode

    // Verification Code expires in 20 Minutes
    user.verificationCodeExpiresAt = Date.now() + 20 * 60 * 1000
    await user.save()

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_MAIL,
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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Verify email using verification code
export const verifyEmail = async (req, res) => {
  try {
    const { userId, verificationCode } = req.body

    if (!userId || !verificationCode) {
      return res.status(422).json({
        success: false,
        message: 'Details missing!!'
      })
    }

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'User not found!!'
      })
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCode === ''
    ) {
      return res.status(500).json({
        success: false,
        message: 'Invalid verification code!!'
      })
    }

    if (user.verificationCodeExpiresAt < Date.now()) {
      return res.status(500).json({
        success: false,
        message: 'Verification code expired!!'
      })
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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: null
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Send Password reset verification code
export const sendPasswordResetVerificationCode = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(422).json({
        success: false,
        message: 'Email field is required!'
      })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(422).json({
        success: false,
        message: 'Email is not registered!'
      })
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
      from: process.env.SENDER_MAIL,
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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Reset password using code
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetPasswordCode } = req.body

    if (!email || newPassword || resetPasswordCode) {
      return res.status(422).json({
        success: false,
        message: 'Email/Password/Reset Code is required!'
      })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(422).json({
        success: false,
        message: 'Email is not registered!'
      })
    }

    if (
      user.resetPasswordCode === '' ||
      user.resetPasswordCode !== resetPasswordCode
    ) {
      return res.status(422).json({
        success: false,
        message: 'Invalid Reset code!'
      })
    }

    if (user.resetPasswordCodeExpiresAt < Date.now()) {
      return res.status(422).json({
        success: false,
        message: 'Reset code is expired!'
      })
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
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
