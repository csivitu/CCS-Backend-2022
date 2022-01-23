import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
  // eslint-disable-next-line @typescript-eslint/ban-types
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(object, config.get<string>(keyName), {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  // console.log(token)
  const publicKey = config.get<string>(keyName);

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    console.error(e);
    return null;
  }
}
