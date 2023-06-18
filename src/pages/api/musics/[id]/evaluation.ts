import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "PUT") return;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (session == null || session.user?.email == null) {
      res.status(401).json({
        message: "ログインしてください",
      });
      return;
    }

    const { evaluation } = req.body;
    if (evaluation == null) {
      res.status(400).json({
        message: "不正なreq.body",
        body: { evaluation },
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });
    if (user == null) {
      // ほとんどあり得ないが、退会済みのアカウントで起こりうるかもしれないので、以下の対応をしている
      res.status(403).json({
        message: "許可されていないユーザーです",
      });
      return;
    }

    const music = await prisma.music.findUnique({
      where: {
        id: String(id),
      },
    });
    if (music == null) {
      return res.status(404).json({ message: "musicが見つかりませんでした。" });
    }

    const evaluated = await prisma.musicEvaluation.upsert({
      where: {
        musicId_userId: {
          musicId: music.id,
          userId: user.id,
        },
      },
      update: {
        evaluation,
      },
      create: {
        musicId: music.id,
        userId: user.id,
        evaluation,
      },
    });

    res.status(200).json(evaluated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
