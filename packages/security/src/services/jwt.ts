import { existsSync, mkdirSync, readFileSync } from "fs";
import { importPKCS8, importSPKI, jwtVerify, SignJWT, errors } from "jose";
import { v7 } from "uuid";
import { getAbsolutePath } from "../utils";
import { ErrorResp } from "../models/errorResp";

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
  const decryptedToken = await decodeJwt(token);

  return token;
};

export const decodeJwt = async <T extends unknown>(
  token: string,
  algorithm = "RS256"
): Promise<ErrorResp<T>> => {
  try {
    const publicKey = await importSPKI(keys.publicKeyPem, algorithm);
    const decryptedToken = await jwtVerify<{ data: any }>(token, publicKey);
    return {
      isError: false,
      message: "Token verificado",
      statusCode: 200,
      data: decryptedToken.payload.data,
    };
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return {
        isError: true,
        message: "Sesión caducada",
        statusCode: 401,
      };
    } else if (error instanceof errors.JWTInvalid) {
      return {
        isError: true,
        message: "La sesión no es válida.",
        statusCode: 401,
      };
    }
    return {
      isError: true,
      message: "No se pudo verificar",
      statusCode: 500,
    };
  }
};
