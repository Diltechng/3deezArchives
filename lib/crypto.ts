import crypto from "crypto";

export function sha256Hash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function generateInvitationToken() {
  return crypto.randomBytes(32).toString("base64url");
}