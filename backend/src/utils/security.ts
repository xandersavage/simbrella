// src/utils/security.ts

import bcrypt from "bcryptjs";

const saltRounds = 12;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
