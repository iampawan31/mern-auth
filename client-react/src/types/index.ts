import { LOGIN_STATES } from "../constants"

export type LoginStateType = (typeof LOGIN_STATES)[keyof typeof LOGIN_STATES]

export type UserData = {
  fullName: string
  email: string
  isVerified: boolean
}
