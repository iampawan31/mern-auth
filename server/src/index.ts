import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import 'express-async-errors'
import { loadAndValidateConfig } from './config/environmentTokens'
import connectDB from './config/mongodb'
import { errorHandler } from './middlewares/errorHandler'
import authRouter from './routes/authRoutes'
import userRouter from './routes/userRoutes'

loadAndValidateConfig()

const app: express.Express = express()

const port = process.env.PORT || 4000

const allowedOrigins = '*'

connectDB()

app.use(express.json())

app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

// API Endpoints
app.get('/', (req: Request, res: Response): any =>
  res.json({ success: true, message: 'API Working!!' })
)

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`))
  // Or, if you have a custom NotFoundError:
  // next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
})

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on PORT:${port}`))
