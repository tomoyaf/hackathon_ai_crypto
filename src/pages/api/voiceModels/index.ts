import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import * as contractService from "@/services/contract";
import { VOICE_MODEL_SOURCE_TYPE } from "@/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      try {
        const q = (req.query.q ?? "") as string;
        const voiceModels = await prisma.voiceModel.findMany({
          where: {
            title: {
              contains: q,
            },
          },
          take: 100,
        });

        res.status(200).json(voiceModels.map((v) => ({ ...v, url: "" })));
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
      }
      return;
    }
    case "POST": {
      try {
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
          rvcModelUrl,
          rule,
          transactionHash,
          actionUserAddress,
        } = req.body;

        if (
          title == null ||
          description == null ||
          thumbnailUrl == null ||
          rvcModelUrl == null ||
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
              rvcModelUrl,
              rule,
            },
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
            rule,
            sourceType: VOICE_MODEL_SOURCE_TYPE.UPLOADED,
          },
        });

        // transactionが承認されてからaccept処理を行う
        await contractService.addPendingTransaction(
          transactionHash,
          actionUserAddress,
          contractService.TRANSACTION_TYPE.ADD_MINTABLE_ITEM,
          { voiceModelId: savedVoiceModel.id }
        );

        res.status(200).json({ savedVoiceModel });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
      }
      return;
    }
  }

  res.status(400).json({ message: "対応していないreq.methodが指定されました" });
}
