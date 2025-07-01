interface EnvironmentConfig {
  viteApiUrl: string
}

// Initialize with default or empty values, these will be overwritten
const envConfig: EnvironmentConfig = {
  viteApiUrl: ""
}

export function loadAndValidateEnvironment(): void {
  // JWT Secret
  const viteApiUrl = import.meta.env.VITE_API_URL

  if (!viteApiUrl) {
    console.error(
      "FATAL ERROR: VITE_API_URL environment variable is not defined."
    )

    throw new Error("Missing critical environment variable: VITE_API_URL")
  }

  envConfig.viteApiUrl = viteApiUrl

  console.log("Frontend environment configuration loaded successfully.")
}

// Export the validated config object to be used throughout your application
export default envConfig
