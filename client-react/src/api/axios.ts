import axios, { type AxiosInstance } from "axios"
import envConfig from "../config/environmentTokens"

let axiosInstance: AxiosInstance | null = null

export const initializeAxios = (): AxiosInstance => {
  if (axiosInstance) {
    // If already initialized, return the existing instance (singleton pattern)
    return axiosInstance
  }

  // Ensure environment config has been loaded (though main.tsx should guarantee this)
  if (!envConfig.viteApiUrl) {
    throw new Error(
      "Axios initialization error: environmentConfig.viteApiUrl is not set. Ensure loadAndValidateEnvironment() runs first."
    )
  }

  const instance = axios.create({
    baseURL: envConfig.viteApiUrl,
    timeout: 100000,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true
    }
  })

  // --- Request Interceptor ---
  instance.interceptors.request.use(
    (config) => {
      // Get token from localStorage, Redux store, Context, etc.
      const token = localStorage.getItem("authToken") // Or wherever you store your token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      // console.log('Request sent:', config); // Optional: for debugging
      return config
    },
    (error) => {
      // Do something with request error
      console.error("Request Error:", error)
      return Promise.reject(error)
    }
  )

  // --- Response Interceptor ---
  instance.interceptors.response.use(
    (response) => {
      // Any global handling for successful responses
      // console.log('Response received:', response); // Optional: for debugging
      return response
    },
    (error) => {
      // Global error handling for all API responses
      console.error("Response Error:", error.response || error.message)

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response

        if (status === 401) {
          // Handle Unauthorized errors (e.g., redirect to login)
          console.error("Unauthorized! Redirecting to login...")
          // Example: If using React Router, you might redirect:
          // window.location.href = '/login';
          // You can also dispatch a logout action if using Redux/Context
          // For AppError, you could throw:
          // return Promise.reject(new AppError(data.message || 'Unauthorized', 401));
        } else if (status === 403) {
          console.error("Forbidden! You do not have permission.")
          // return Promise.reject(new AppError(data.message || 'Forbidden', 403));
        } else if (status === 404) {
          console.error("Not Found!")
          // return Promise.reject(new AppError(data.message || 'Not Found', 404));
        } else if (status >= 500) {
          console.error("Server Error!")
          // return Promise.reject(new AppError(data.message || 'Server Error', 500));
        }
        // Re-throw the error so it can be caught by the specific component's catch block
        return Promise.reject(error)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request)
        return Promise.reject(
          new Error(
            "No response from server. Please check your network connection."
          )
        )
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Axios Error:", error.message)
        return Promise.reject(
          new Error(`Request setup failed: ${error.message}`)
        )
      }
    }
  )

  axiosInstance = instance // Store the initialized instance
  return axiosInstance
}

// You might also export a getter for the instance, or just rely on initializeAxios being called
// before any component tries to use it.
// For simplicity in usage, we can export a function to get the instance:
export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    throw new Error(
      "Axios instance not initialized. Call initializeAxios() first."
    )
  }
  return axiosInstance
}
