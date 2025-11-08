import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { exportJWK, exportPKCS8, exportSPKI, generateKeyPair } from "jose";
import { asn1, md, pki } from "node-forge";
import { util } from "node-forge";
import { getAbsolutePath } from "../helpers/getAbsolutePath";

const generateJwkCertificate = (
  privateKeyPem: string,
  publicKeyPem: string
) => {
  const certificateAttrs = [
    { name: "countryName", value: "CO" },
    { name: "stateOrProvinceName", value: "Cesar" },
    { name: "localityName", value: "Valledupar" },
    { name: "organizationName", value: "Jmartinez" },
    { name: "commonName", value: "imac.com" },
  ];

  const certificate = pki.createCertificate();
  certificate.publicKey = pki.publicKeyFromPem(publicKeyPem);
  certificate.serialNumber = Math.floor(Math.random() * 1000000000).toString();
  certificate.validity.notBefore = new Date();
  certificate.validity.notAfter = new Date();
  certificate.validity.notAfter.setFullYear(
    certificate.validity.notBefore.getFullYear() + 1
  );
  certificate.setSubject(certificateAttrs);
  certificate.setIssuer(certificateAttrs);
  certificate.setExtensions([
    {
      name: "basicConstraints",
      cA: true,
    },
    {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: "extKeyUsage",
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true,
    },
    {
      name: "nsCertType",
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true,
    },
    {
      name: "subjectAltName",
      altNames: [
        {
          type: 6, // URI
          value: "http://localhost",
        },
        {
          type: 7, // IP
          ip: "127.0.0.1",
        },
      ],
    },
    {
      name: "subjectKeyIdentifier",
    },
  ]);
  const privateKey = pki.privateKeyFromPem(privateKeyPem);
  certificate.sign(privateKey, md.sha256.create());
  const asn1DerCertificate = asn1
    .toDer(pki.certificateToAsn1(certificate))
    .getBytes();
  const sha1Thumbprint = md.sha1
    .create()
    .update(asn1DerCertificate)
    .digest()
    .getBytes();
  const x5t = util
    .encode64(sha1Thumbprint)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const pemCertificate = pki.certificateToPem(certificate);
  const lines = pemCertificate
    .split("\r\n")
    .filter((line: string) => line.length > 0);
  const x5c = [lines.slice(1, -1).join("")];

  return { x5t, x5c };
};

const generateJwk = async (
  algorithm: string,
  modulusLength: number,
  id: string
) => {
  const keyPair = await generateKeyPair(algorithm, {
    modulusLength,
    extractable: true,
  });
  const jwk = await exportJWK(keyPair.publicKey);
  const privateKeyPem = await exportPKCS8(keyPair.privateKey);
  const publicKeyPem = await exportSPKI(keyPair.publicKey);
  const jwkCertificate = generateJwkCertificate(privateKeyPem, publicKeyPem);

  return {
    jwk: {
      ...jwk,
      ...jwkCertificate,
      kid: id,
      use: "sig",
      alg: algorithm,
    },
    meta: {
      privateKeyPem,
      publicKeyPem,
    },
  };
};

const printPk = (publicKeyPem: string) => {
  console.info(
    "=============================Public key PEM============================="
  );
  console.info(publicKeyPem);
  console.info(
    "========================================================================"
  );
};

export const initJwk = async () => {
  let publicKeyPem;
  const workDir = getAbsolutePath() + "/generated/jwk";
  if (existsSync(`${workDir}/jwk-meta.json`)) {
    const file = readFileSync(workDir + "/jwk-meta.json").toString();
    publicKeyPem = JSON.parse(file).publicKeyPem;
  } else {
    const keyId = process.env.SECRET_SEED ?? "mFUCwg9u3YcX8z";

    const { jwk, meta } = await generateJwk("RS256", 2048, keyId);
    publicKeyPem = meta.publicKeyPem;
    const dir = getAbsolutePath() + "/generated/jwk";

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(`${dir}/jwk.json`, JSON.stringify(jwk, null, 4));
    writeFileSync(`${dir}/jwk-meta.json`, JSON.stringify(meta, null, 4));
  }
  printPk(publicKeyPem);
};
