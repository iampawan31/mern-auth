import nodemailer from 'nodemailer'
import environmentConfig from './environmentTokens'

const transporter = nodemailer.createTransport({
  host: environmentConfig.smtpHost,
  port: environmentConfig.smtpPort,
  auth: {
    user: environmentConfig.smtpUser,
    pass: environmentConfig.smtpPassword
  }
})

export default transporter
