interface MailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  senderMail: string
}

// Initialize with default or empty values, these will be overwritten
const environmentMailConfig: MailConfig = {
  smtpHost: '',
  smtpPort: 0,
  smtpUser: '',
  smtpPassword: '',
  senderMail: ''
}

export function loadAndValidateMailConfig(): void {
  //   SMTP_HOST
  const smtpHost = process.env.SMTP_HOST

  if (!smtpHost) {
    console.error('FATAL ERROR: SMTP_HOST environment variable is not defined.')
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentMailConfig.smtpHost = smtpHost

  //   SMTP_PORT
  const smtpPortStr = process.env.SMTP_PORT

  if (!smtpPortStr || isNaN(parseInt(smtpPortStr, 10))) {
    // Check if it's undefined or not a number
    console.error(
      'FATAL ERROR: SMTP_PORT environment variable is not defined or is not a valid number.'
    )
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1)
  }

  const parsedSmtpPort = parseInt(smtpPortStr, 10) // Parse to integer
  if (parsedSmtpPort < 1 || parsedSmtpPort > 65535) {
    // Validate port range
    console.error(
      `FATAL ERROR: SMTP_PORT ${parsedSmtpPort} is out of valid port range (1-65535).`
    )
    process.exit(1)
  }

  environmentMailConfig.smtpPort = parsedSmtpPort

  //   SMTP_USER
  const smtpUser = process.env.SMTP_USER

  if (!smtpUser) {
    console.error('FATAL ERROR: SMTP_USER environment variable is not defined.')
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentMailConfig.smtpUser = smtpUser

  //   SMTP_PASSWORD
  const smtpPassword = process.env.SMTP_PASSWORD

  if (!smtpPassword) {
    console.error(
      'FATAL ERROR: SMTP_PASSWORD environment variable is not defined.'
    )
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentMailConfig.smtpPassword = smtpPassword

  //   SENDER_MAIL
  const senderMail = process.env.SENDER_MAIL

  if (!senderMail) {
    console.error(
      'FATAL ERROR: SENDER_MAIL environment variable is not defined.'
    )
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentMailConfig.senderMail = senderMail

  console.log('Mail configuration loaded successfully.')
}

// Export the validated config object to be used throughout your application
export default environmentMailConfig
