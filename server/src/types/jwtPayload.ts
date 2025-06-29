import { JwtPayload } from 'jsonwebtoken'

// Extend the default JwtPayload with your custom claims
export interface MyTokenPayload extends JwtPayload {
  id: string // Assuming your user ID is a string, adjust type if it's a number
  email?: string // If you include email, make it optional if it sometimes might not be there
  role?: string // If you include role
  // Add any other custom data you put into your JWT token when signing it
}
