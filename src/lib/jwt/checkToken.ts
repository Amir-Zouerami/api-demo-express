import crypto from "crypto";

const base64UrlDecode = (encoded: string): string => {
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (encoded.length % 4) {
    encoded += "=";
  }
  return Buffer.from(encoded, "base64").toString("utf-8");
};

const verifySignature = (
  data: string,
  signature: string,
  key: string
): boolean => {
  const hmac = crypto.createHmac("sha256", key);
  const expectedSignature = hmac.update(data).digest("base64");
  return base64UrlDecode(signature) === expectedSignature;
};

export const validateJwtToken = (token: string): boolean => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid token format");
    return false;
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const decodedPayload = JSON.parse(base64UrlDecode(encodedPayload));

    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    if (
      verifySignature(dataToVerify, signature, process.env.jwt_secret as string)
    ) {
      const currentTime = Math.floor(Date.now());
      // Check if the token is not expired
      if (decodedPayload.exp && decodedPayload.exp < currentTime) {
        console.error("Token has expired");
        return false;
      }
      return true;
    } else {
      console.error("Signature verification failed");
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return false;
};

// Example usage
// const jwtToken = "your_jwt_token_here";
// const secretKey = "your_secret_key";

// const isValid = validateJwtToken(jwtToken, secretKey);
// console.log("Is Valid:", isValid);
