interface AppConfig {
  jwtSecret: string
  mongoUri: string
}

// Initialize with default or empty values, these will be overwritten
const environmentConfig: AppConfig = {
  jwtSecret: '',
  mongoUri: ''
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

  console.log('Application configuration loaded successfully.')
}

// Export the validated config object to be used throughout your application
export default environmentConfig
