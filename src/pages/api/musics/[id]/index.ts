import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const findUser = async (email: string | null) => {
  if (email == null) return null;

  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") return;

  try {
    const session = await getServerSession(req, res, authOptions);
    const user = await findUser(session?.user?.email ?? null);

    const music = await prisma.music.findUnique({
      where: {
        id: String(id),
      },
      include: {
        musicEvaluations: true,
        voiceModel: true,
      },
    });

    if (!music) {
      return res.status(404).json({ message: "musicが見つかりませんでした。" });
    }

    res.status(200).json({
      ...music,
      isLiked:
        user?.id != null &&
        music.musicEvaluations.some(
          (musicEvaluation) =>
            musicEvaluation.userId === user?.id &&
            musicEvaluation.evaluation > 0
        ),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
