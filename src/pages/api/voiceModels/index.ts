import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (session == null || session.user?.email == null) {
      res.status(401).json({
        message: "ログインしてください",
      });
      return;
    }

    const { title, description, thumbnailUrl, rvcModelUrl } = req.body;

    if (
      title == null ||
      description == null ||
      thumbnailUrl == null ||
      rvcModelUrl == null
    ) {
      res.status(400).json({
        message: "不正なreq.body",
        body: { title, description, thumbnailUrl, rvcModelUrl },
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

    const savedVoiceModel = await prisma.voiceModel.create({
      data: {
        title,
        description,
        thumbnailUrl,
        url: rvcModelUrl,
        userId: user.id,
      },
    });

    res.status(200).json({ savedVoiceModel });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
