import { NextApiRequest, NextApiResponse } from "next";
import { getAuthKey } from "@/services/contract";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;
  if (req.query.address == null) {
    res.status(400).json({ message: "不正なリクエストです。" });
    return;
  }

  const authKey = await getAuthKey(req.query.address as string);
  res.status(200).json({ authKey });
}
