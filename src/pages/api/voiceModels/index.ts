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
    const q = (req.query.q ?? "") as string;
    const voiceModels = await prisma.voiceModel.findMany({
      where: {
        title: {
          contains: q,
        },
      },
    });

    res.status(200).json(voiceModels);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}
