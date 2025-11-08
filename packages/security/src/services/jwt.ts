import { existsSync, mkdirSync, readFileSync } from "fs";
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";
import { v7 } from "uuid";
import { getAbsolutePath } from "../helpers/getAbsolutePath";

const dir = getAbsolutePath() + "/generated/jwk";
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

interface Keys {
  privateKeyPem: string;
  publicKeyPem: string;
}
let keys: Keys;
let kid: string;

export const setBoundData = () => {
  const dir = getAbsolutePath() + "/generated/jwk";
  kid = JSON.parse(readFileSync(`${dir}/jwk.json`).toString()).kid;
  keys = JSON.parse(readFileSync(`${dir}/jwk-meta.json`).toString());
};

export const generateJwt = async (
  data: any,
  secondsToExpire: number,
  algorithm = "RS256",
  keyId = kid,
  jwtId = v7()
) => {
  const privateKey = await importPKCS8(keys.privateKeyPem, algorithm);
  const now = Math.round(Date.now() / 1000);
  const claims = {
    data,
    iat: now, // time when token was issued
    jti: jwtId, // unique JWT id
  };
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: algorithm, typ: "JWT", kid: keyId })
    .setExpirationTime(`${secondsToExpire}s`)
    .sign(privateKey);
  try {
    const decryptedToken = await decodeJwt(token);
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  return token;
};

export const decodeJwt = async (token: string, algorithm = "RS256") => {
  const publicKey = await importSPKI(keys.publicKeyPem, algorithm);
  const decryptedToken = await jwtVerify<{ data: any }>(token, publicKey);
  return decryptedToken;
};
