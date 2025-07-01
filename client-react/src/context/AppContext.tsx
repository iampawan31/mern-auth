import { useState } from "react"
import type { UserData } from "../types"
import { AppContext, type AppContextType } from "./AppContextDefinition"

export const AppContextProvider = (props: React.PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  const value: AppContextType = {
    isLoggedIn,
    userData,
    setIsLoggedIn,
    setUserData
  }
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  )
}
