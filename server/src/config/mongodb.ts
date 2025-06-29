import mongoose from 'mongoose'
import environmentConfig from './environmentTokens.ts'

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database connected'))

  await mongoose.connect(`${environmentConfig.mongoUri}/mern-auth`)
}

export default connectDB
