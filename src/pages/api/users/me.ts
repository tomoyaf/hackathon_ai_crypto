import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (session == null || session.user?.email == null) {
      res.status(401).json({
        message: "ログインしてください",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
      include: {
        userVoiceModelPurchases: {
          include: {
            voiceModel: true,
          },
        },
        voiceModels: true,
        originalMusics: true,
        musicEvaluations: {
          where: {
            evaluation: {
              gt: 0,
            },
          },
          include: {
            music: true,
          },
        },
      },
    });

    if (user == null) {
      // ほとんどあり得ないが、退会済みのアカウントで起こりうるかもしれないので、以下の対応をしている
      res.status(403).json({
        message: "許可されていないユーザーです",
      });
      return;
    }

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
