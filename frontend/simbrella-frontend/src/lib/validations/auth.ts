import { z } from "zod";

// Define the backend's password regex
const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordStrengthMessage =
  "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";

// Zod schema for login form validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }), // Validates email format
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }) // Minimum password length
    .regex(passwordStrengthRegex, { message: passwordStrengthMessage }), // Enforce strength rules
});

// Zod schema for signup form validation
export const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    phoneNumber: z.string().optional(), // Phone number is optional on the frontend form
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }) // Minimum password length
      .regex(passwordStrengthRegex, { message: passwordStrengthMessage }), // Enforce strength rules
    passwordConfirm: z
      .string()
      .min(8, {
        message: "Password confirmation must be at least 8 characters long.",
      }) // Minimum password length
      .regex(passwordStrengthRegex, { message: passwordStrengthMessage }), // Enforce strength rules
  })
  .refine((data) => data.password === data.passwordConfirm, {
    // Refine for password confirmation match
    message: "Passwords do not match.",
    path: ["passwordConfirm"], // Sets the error to the passwordConfirm field
  });

// Infer TypeScript types from the schemas for type safety in components
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
