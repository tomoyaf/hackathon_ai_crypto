import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") return;

  try {
    const music = await prisma.music.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!music) {
      return res.status(404).json({ message: "musicが見つかりませんでした。" });
    }

    res.status(200).json(music);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
