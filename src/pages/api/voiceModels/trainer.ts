import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";
import * as contractService from "@/services/contract";
import { VOICE_MODEL_SOURCE_TYPE } from "@/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;
  const session = await getServerSession(req, res, authOptions);
  if (session == null || session.user?.email == null) {
    res.status(401).json({
      message: "ログインしてください",
    });
    return;
  }

  const {
    title,
    description,
    thumbnailUrl,
    audioUrl,
    rule,
    transactionHash,
    actionUserAddress,
  } = req.body;

  if (
    title == null ||
    description == null ||
    thumbnailUrl == null ||
    audioUrl == null ||
    rule == null ||
    transactionHash == null ||
    actionUserAddress == null
  ) {
    res.status(400).json({
      message: "不正なreq.body",
      body: {
        title,
        description,
        thumbnailUrl,
        audioUrl,
        rule,
      },
    });
    return;
  }

  const user = await prisma.user.findUnique({
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
      userId: user.id,
      rule,
      audioUrl,
      sourceType: VOICE_MODEL_SOURCE_TYPE.GENERATED,
    },
  });

  // transactionが承認されてから学習を開始する
  await contractService.addPendingTransaction(
    transactionHash,
    actionUserAddress,
    contractService.TRANSACTION_TYPE.ADD_MINTABLE_ITEM,
    { voiceModelId: savedVoiceModel.id }
  );

  res.status(200).json({ savedVoiceModel });
}
