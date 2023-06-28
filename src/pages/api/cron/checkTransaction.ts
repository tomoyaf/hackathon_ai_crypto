import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import * as contractService from "@/services/contract";
import * as trainerService from "@/services/rvcTrainer";
import { VOICE_MODEL_SOURCE_TYPE } from "@/constants";
import { setTimeout } from "timers/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;

  const transactions = await prisma.contractTransaction.findMany({
    where: {
      status: contractService.TRANSACTION_STATUS.PENDING,
    },
  });

  for (const transaction of transactions) {
    try {
      const success = await contractService.checkTransactionSuccess(
        transaction.transactionHash
      );

      if (!success) continue;
      await prisma.contractTransaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: contractService.TRANSACTION_STATUS.SUCCESS,
        },
      });

      const { voiceModelId } = transaction;
      if (!voiceModelId) throw new Error("voiceModelId is not set");

      // voiceID取得
      const voiceId = await contractService.extractVoiceIdFromTxHash(
        transaction.transactionHash
      );
      if (!voiceId) throw new Error("voiceId is not set");

      await prisma.voiceModel.update({
        where: {
          id: voiceModelId,
        },
        data: {
          voiceId,
        },
      });

      if (
        transaction.type === contractService.TRANSACTION_TYPE.ADD_MINTABLE_ITEM
      ) {
        const voiceModel = await prisma.voiceModel.findUnique({
          where: {
            id: voiceModelId,
          },
        });

        if (!voiceModel) throw new Error("voiceModel not found");
        // 承認作業
        if (voiceModel.sourceType === VOICE_MODEL_SOURCE_TYPE.UPLOADED) {
          // metadeta.jsonを作成

          const tokenURL = await contractService.createTokenUrl({
            name: voiceModel.title,
            description: voiceModel.description,
            image: voiceModel?.thumbnailUrl,
            voiceId,
            voiceModelId: voiceModel.id,
          });

          // コントラクトに承認をリクエスト
          await contractService.acceptAddMintableItem(voiceId, tokenURL);
          // トレーニング開始
        } else if (
          voiceModel.sourceType === VOICE_MODEL_SOURCE_TYPE.GENERATED
        ) {
          const { audioUrl } = voiceModel;
          if (!audioUrl) throw new Error("audioUrl is not set");
          const configFile = await trainerService.createTrainerConfig(
            voiceModel.id
          );

          await trainerService.requestTraining(
            voiceModel.id,
            audioUrl,
            configFile.publicUrl()
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await setTimeout(1000);
    }
  }

  res.status(200).json({ message: "ok" });
}
