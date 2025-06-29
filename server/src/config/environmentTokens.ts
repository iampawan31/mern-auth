interface AppConfig {
  jwtSecret: string
  // Add other critical environment variables here, e.g.:
  // mongoUri: string;
  // port: number;
}

// Initialize with default or empty values, these will be overwritten
const environmentConfig: AppConfig = {
  jwtSecret: ''
  // mongoUri: '',
  // port: 0,
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

  // Add validation for other environment variables if you have them
  // Example:
  // const mongoUri = process.env.MONGO_URI;
  // if (!mongoUri) {
  //   console.error('FATAL ERROR: MONGO_URI environment variable is not defined.');
  //   process.exit(1);
  // }
  // config.mongoUri = mongoUri;

  console.log('Application configuration loaded successfully.')
}

// Export the validated config object to be used throughout your application
export default environmentConfig
