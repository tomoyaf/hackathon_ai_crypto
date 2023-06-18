import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

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
  if (req.method !== "GET") return;

  try {
    const session = await getServerSession(req, res, authOptions);
    const user = await findUser(session?.user?.email ?? null);

    const musics = await prisma.music.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        musicEvaluations: true,
        voiceModel: true,
      },
    });

    res.status(200).json({
      musics: musics.map((music) => ({
        ...music,
        isLiked:
          user?.id != null &&
          music.musicEvaluations.some(
            (musicEvaluation) =>
              musicEvaluation.userId === user?.id &&
              musicEvaluation.evaluation > 0
          ),
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
