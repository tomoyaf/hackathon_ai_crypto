import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") return;

  try {
    const originalMusic = await prisma.originalMusic.findUnique({
      where: {
        id: String(id),
      },
      include: {
        musics: true,
      },
    });

    if (!originalMusic) {
      return res
        .status(404)
        .json({ message: "originalMusicが見つかりませんでした。" });
    }

    res.status(200).json(originalMusic);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
