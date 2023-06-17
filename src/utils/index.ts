// NOTE: これはバックエンド用のファイルなのでフロントエンドから呼び出してはいけません

import crypto from "crypto";

export const generateRandomString = (len: number) => {
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(crypto.randomFillSync(new Uint8Array(len)))
    .map((n) => S[n % S.length])
    .join("");
  // return crypto.randomBytes(len).toString("base64").substring(0, len);
};
