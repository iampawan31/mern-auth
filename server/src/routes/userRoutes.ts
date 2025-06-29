import express from 'express'
import userAuth from '../middlewares/userAuth'
import { getUserProfile } from '../controllers/userController'

const userRouter = express.Router()

userRouter.get('/profile', userAuth, getUserProfile)

export default userRouter
