import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

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
