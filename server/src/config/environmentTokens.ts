interface AppConfig {
  jwtSecret: string
  mongoUri: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  senderMail: string
}

// Initialize with default or empty values, these will be overwritten
const environmentConfig: AppConfig = {
  jwtSecret: '',
  mongoUri: '',
  smtpHost: '',
  smtpPort: 0,
  smtpUser: '',
  smtpPassword: '',
  senderMail: ''
}

export function loadAndValidateConfig(): void {
  // JWT Secret
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    console.error(
      'FATAL ERROR: JWT_SECRET environment variable is not defined.'
    )
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentConfig.jwtSecret = jwtSecret

  //   MONGO_DB_URI
  const mongoUri = process.env.MONGO_DB_URI

  if (!mongoUri) {
    console.error(
      'FATAL ERROR: MONGO_DB_URI environment variable is not defined.'
    )
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentConfig.mongoUri = mongoUri

  //   SMTP_HOST
  const smtpHost = process.env.SMTP_HOST

  if (!smtpHost) {
    console.error('FATAL ERROR: SMTP_HOST environment variable is not defined.')
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentConfig.smtpHost = smtpHost

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

  environmentConfig.smtpPort = parsedSmtpPort

  //   SMTP_USER
  const smtpUser = process.env.SMTP_USER

  if (!smtpUser) {
    console.error('FATAL ERROR: SMTP_USER environment variable is not defined.')
    console.error(
      'Please ensure your .env file is correctly set up or the variable is in your environment.'
    )
    process.exit(1) // Exit the process immediately if a critical config is missing
  }

  environmentConfig.smtpUser = smtpUser

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

  environmentConfig.smtpPassword = smtpPassword

  console.log('Application configuration loaded successfully.')
}

// Export the validated config object to be used throughout your application
export default environmentConfig
