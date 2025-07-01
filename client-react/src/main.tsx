import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import { AppContextProvider } from "./context/AppContext.tsx"
import "./index.css"
import { loadAndValidateEnvironment } from "./config/environmentTokens"
import { initializeAxios } from "./api/axios.ts"

try {
  loadAndValidateEnvironment()
  initializeAxios()
} catch (error) {
  console.error("Application startup failed:", error)

  // You might render a fallback error UI here instead of crashing silently
  createRoot(document.getElementById("root")!).render(
    <div>
      <h1>Application Error</h1>
      <p>Failed to load essential configuration. Please try again later.</p>
      <p>{(error as Error).message}</p>
    </div>
  )
  // Prevent further rendering of the app if critical config is missing
  throw error // Re-throw to indicate a critical failure
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
)
