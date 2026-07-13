import jwt from "jsonwebtoken";

export function signAdminToken(payload) {
  return jwt.sign(payload, process.env.ADMIN_SECRET_KEY, { expiresIn: "7d" });
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, process.env.ADMIN_SECRET_KEY);
  } catch {
    return null;
  }
}