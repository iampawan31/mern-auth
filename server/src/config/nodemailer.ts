import nodemailer from 'nodemailer'
import environmentMailConfig, { loadAndValidateMailConfig } from './mailConfig'

loadAndValidateMailConfig()

const transporter = nodemailer.createTransport({
  host: environmentMailConfig.smtpHost,
  port: environmentMailConfig.smtpPort,
  auth: {
    user: environmentMailConfig.smtpUser,
    pass: environmentMailConfig.smtpPassword
  }
})

export default transporter
