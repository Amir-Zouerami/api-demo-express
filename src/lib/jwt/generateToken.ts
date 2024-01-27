import crypto from "crypto";

/**
 * takes a string and returns a **url-safe** base64 string
 * by removing the `+` and `\` and `=`.
 * @param data string to be encoded
 * @returns base64 string
 */
const base64UrlEncode = (data: string) => {
  let base64 = Buffer.from(data).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const createJWT = (payload: Record<string, unknown>) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const currentDate = new Date();
  const nextDayDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(
    JSON.stringify({ ...payload, exp: nextDayDate })
  );

  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", process.env.jwt_secret as string)
    .update(signatureInput)
    .digest("base64");
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

// const payload = { user_id: 123, username: "example_user" };
// const secretKey = "your_secret_key";

// const jwt = createJWT(payload, secretKey);

// console.log("Generated JWT:", jwt);
