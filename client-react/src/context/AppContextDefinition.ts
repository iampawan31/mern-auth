import type { UserData } from "../types"
import { createContext } from "react"

export type AppContextType = {
  isLoggedIn: boolean
  userData: UserData | null
  setIsLoggedIn: (isLoggedIn: boolean) => void
  setUserData: (userData: UserData | null) => void
}

export const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  userData: null,
  setIsLoggedIn: () => {},
  setUserData: () => {}
})
