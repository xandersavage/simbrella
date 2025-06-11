// Application-wide constants and configuration
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const PORT = process.env.PORT || 3000;

export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};
