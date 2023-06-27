import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import * as trainerService from "@/services/rvcTrainer";
import * as contractService from "@/services/contract";
import { setTimeout } from "timers/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;

  const jobs = await prisma.voiceModelTrainJob.findMany({
    where: {
      status: {
        in: [
          trainerService.JOB_STATUS.IN_QUEUE.type,
          trainerService.JOB_STATUS.IN_PROGRESS.type,
        ],
      },
    },
  });

  for (const job of jobs) {
    try {
      const result = await trainerService.getTrainingStatus(job.jobId);
      const status =
        Object.values(trainerService.JOB_STATUS).find(
          (s) => s.label === result.status
        )?.type ?? trainerService.JOB_STATUS.FAILED.type;

      await prisma.voiceModelTrainJob.update({
        where: {
          id: job.id,
        },
        data: {
          status: status,
        },
      });

      if (status === trainerService.JOB_STATUS.FINISHED.type) {
        await prisma.voiceModel.update({
          where: {
            id: job.voiceModelId,
          },
          data: {
            url: result.output?.model_url,
          },
        });

        const voiceModel = await prisma.voiceModel.findUnique({
          where: {
            id: job.voiceModelId,
          },
        });

        if (!voiceModel) throw new Error("voiceModel not found");
        const tokenURL = await contractService.createTokenUrl({
          name: voiceModel.title,
          description: voiceModel.description,
          image: voiceModel?.thumbnailUrl,
          voiceId: voiceModel.voiceId,
          voiceModelId: voiceModel.id,
        });

        await contractService.acceptAddMintableItem(
          voiceModel.voiceId,
          tokenURL
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      await setTimeout(1000);
    }
  }

  res.status(200).json({ message: "ok" });
}
