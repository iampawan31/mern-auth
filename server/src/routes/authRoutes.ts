import express from 'express'
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendPasswordResetVerificationCode,
  sendVerificationCode,
  verifyEmail
} from '../controllers/authController'
import userAuth from '../middlewares/userAuth'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/logout', userAuth, logout)
authRouter.post('/register', register)
authRouter.post('/send-verification-code', userAuth, sendVerificationCode)
authRouter.post('/verify-email', userAuth, verifyEmail)
authRouter.get('/authenticated', userAuth, isAuthenticated)
authRouter.post('/send-reset-code', sendPasswordResetVerificationCode)
authRouter.post('/reset-password', resetPassword)

export default authRouter
