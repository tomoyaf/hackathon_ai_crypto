import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

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
  const { voiceId } = req.query;

  if (req.method !== "GET" || voiceId == null) {
    res.status(400).end();
    return;
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const user = await findUser(session?.user?.email ?? null);

    const voiceModel = await prisma.voiceModel.findUnique({
      where: {
        voiceId: ~~voiceId,
      },
      include: {
        musics: {
          include: {
            musicEvaluations: true,
            voiceModel: true,
          },
        },
      },
    });

    if (!voiceModel) {
      return res
        .status(404)
        .json({ message: "VoiceModelが見つかりませんでした。" });
    }

    res.status(200).json({
      ...voiceModel,
      musics: [
        ...voiceModel.musics.map((m) => ({
          ...m,
          voiceModel: {
            ...m.voiceModel,
            url: "",
          },
          isLiked:
            user?.id != null &&
            m.musicEvaluations.some(
              (musicEvaluation) =>
                musicEvaluation.userId === user?.id &&
                musicEvaluation.evaluation > 0
            ),
        })),
      ],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
