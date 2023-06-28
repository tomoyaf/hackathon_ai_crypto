import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyAddress, ownedVoiceCount } from "@/services/contract";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, signature } = req.body;
  const { voiceId } = req.query;

  if (req.method !== "POST") return;

  if (!address || !signature || voiceId == null) {
    res.status(400).json({ message: "不正なリクエストです。" });
    return;
  }

  const verified = await verifyAddress(address, signature);
  if (!verified) {
    res.status(400).json({ message: "認証できませんでした。" });
    return;
  }

  const voiceModel = await prisma.voiceModel.findUnique({
    where: { voiceId: +voiceId },
  });
  if (!voiceModel) {
    res.status(404).json({ message: "VoiceModelが見つかりませんでした。" });
    return;
  }

  const ownedCount = await ownedVoiceCount(address, +voiceId);
  if (ownedCount < 1) {
    res.status(400).json({ message: "所有してません" });
    return;
  }

  res.status(200).json({ modelDownloadUrl: voiceModel.url });
}
