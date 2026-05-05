import crypto from "crypto";

export function generateHash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}


export function generateRandomString() {
  return crypto.randomBytes(32).toString("base64url");
}