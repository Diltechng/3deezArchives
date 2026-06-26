import crypto from "crypto";

export function sha256Hash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

sha256Hash.compare = (data: string, expectedHash: string) => {
  const hashedData = sha256Hash(data);

  const bufA = Buffer.from(hashedData, "hex");
  const bufB = Buffer.from(expectedHash, "hex");

  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufB);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

export function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function generateInvitationToken() {
  return crypto.randomBytes(32).toString("base64url");
}