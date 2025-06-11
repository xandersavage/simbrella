// Types for authentication and user management

import { UserRole } from "../../generated/prisma";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the decoded JWT payload.
export interface JwtPayload {
  id: string;
  // I might add other properties here if they are part of the token's payload, e.g., role: User["role"];
}

// Augment the Express Request interface globally.
// This is crucial for TypeScript to recognize the 'user' property on 'req'
declare global {
  namespace Express {
    interface Request {
      user?: User; // The authenticated user object will be attached here
    }
  }
}

// export interface AuthRequest extends Request {
//   user?: User; // Ensures 'user' property is available and of type 'User'
// }
