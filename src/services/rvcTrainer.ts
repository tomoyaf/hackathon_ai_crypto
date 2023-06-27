import { uploadFile } from "@/utils/storage";
import prisma from "@/utils/prisma";

const API_KEY = process.env.RUNPOD_API_KEY || "";
const ENDPOINT = "https://api.runpod.ai/v2/vvt5j6dmepozdn";

export const JOB_STATUS = {
  IN_QUEUE: { type: 1, label: "IN_QUEUE" },
  IN_PROGRESS: { type: 2, label: "IN_PROGRESS" },
  FINISH: { type: 3, label: "COMPLETED" },
} as const;

export async function createTrainerConfig(voiceKey: string) {
  const configBuf = Buffer.from(
    JSON.stringify({
      model_name: voiceKey,
      ignore_cache: false,
      dataset_glob: `/workspace/download/${voiceKey}/corpus/*.wav`,
      recursive: true,
      multiple_speakers: false,
      speaker_id: 0,
      model_version: "v2",
      target_sampling_rate: "40k",
      f0_model: "Yes",
      using_phone_embedder: "contentvec",
      embedding_channels: "768",
      embedding_output_layer: "12",
      gpu_id: "0",
      number_of_cpu_processes: 8,
      normalize_audio_volume_when_preprocess: "Yes",
      pitch_extraction_algorithm: "crepe",
      batch_size: 40,
      number_of_epochs: 30,
      save_every_epoch: 10,
      cache_batch: true,
      fp16: true,
      augment: false,
      augment_from_pretrain: false,
      pre_trained_generator_path_pth: "file is not prepared",
      speaker_info_path_npy: "file is not prepared",
      pre_trained_generator_path:
        "/workspace/rvc-webui/models/pretrained/v2/f0G40k.pth",
      pre_trained_discriminator_path:
        "/workspace/rvc-webui/models/pretrained/v2/f0D40k.pth",
      train_index: "Yes",
      reduce_index_size_with_kmeans: "No",
      maximum_index_size: 10000,
    })
  );

  const configFile = await uploadFile(
    configBuf,
    `trainer-config/${voiceKey}.json`
  );

  return configFile;
}

export async function requestTraining(
  voiceModelId: string,
  voiceUrl: string,
  configUrl: string
) {
  const response = await fetch(`${ENDPOINT}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      input: {
        voice_key: voiceModelId,
        voice_url: voiceUrl,
        config_url: configUrl,
      },
    }),
  });

  const json: { id: string; status: string } = await response.json();

  await prisma.voiceModelTrainJob.create({
    data: {
      voiceModelId,
      jobId: json.id,
      audioUrl: voiceUrl,
      configUrl,
      status: JOB_STATUS.IN_QUEUE.type,
    },
  });

  return json;
}

export async function getTrainingStatus(id: string) {
  const response = await fetch(`${ENDPOINT}/status/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const json: {
    status: string;
    output?: { model_url: string; voice_key: string };
  } = await response.json();
  return json;
}
