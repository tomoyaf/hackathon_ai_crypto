import { randomUUID } from "node:crypto";
import { uploadFile } from "../utils/storage";
import { ethers } from "ethers";
import prisma from "@/utils/prisma";
// smart-contract フォルダ内でnpm run compileを実行してください
import compiledInfo from "../../smart-contract/artifacts/contracts/VoiceToken.sol/VoiceToken.json";
import { VoiceToken } from "../../smart-contract/typechain-types";

export async function createTokenUrl(metadata: {
  name: string;
  description: string;
  image: string;
}) {
  const fileName = `metadata/${randomUUID()}.json`;
  const metadataBuf = Buffer.from(
    JSON.stringify({
      ...metadata,
      external_url: "https://hackathon-ai-crypto.vercel.app/",
    })
  );
  const metadataFile = await uploadFile(metadataBuf, fileName);
  return metadataFile.publicUrl();
}

type VoiceTokenType = Omit<VoiceToken, keyof ethers.BaseContract> &
  ethers.Contract;
export async function connectContract() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_CHAIN_RPC_URL || ""
  );

  const ownerWallet = new ethers.Wallet(
    process.env.OWNER_PRIVATE_KEY || "",
    provider
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
    compiledInfo.abi,
    ownerWallet
  ) as VoiceTokenType;

  return { contract, ownerWallet, provider };
}

// 現状のガス代に40%上乗せした値を返す
export async function calcGasPrice(provider: ethers.providers.JsonRpcProvider) {
  const gasPrice = await provider.getGasPrice();
  return gasPrice.mul(140).div(100);
}

// 音声販売者が音声モデルをサービス、コントラクト両方に登録後、metadataを登録して販売可能にする
export async function acceptAddMintableItem(
  voiceId: number,
  metadataUrl: string
) {
  const { contract, provider } = await connectContract();
  const gasPrice = await calcGasPrice(provider);
  const tx = await contract.acceptAddMintableItem(voiceId, metadataUrl, {
    type: 2,
    maxFeePerGas: gasPrice,
  });
  await tx.wait();
}

// 販売可能に出来なかった場合、承認待ち情報を削除して登録料を返金する
export async function refund(voiceId: number) {
  const { contract, provider } = await connectContract();
  const [addItemPrice] = await contract.getCurrentSetting();
  const gasPrice = await calcGasPrice(provider);
  const tx = await contract.refundAddMintableItemFee(voiceId, {
    value: addItemPrice,
    type: 2,
    maxFeePerGas: gasPrice,
  });
  await tx.wait();
}

export async function ownedVoiceCount(adress: string, voiceId: number) {
  const { contract } = await connectContract();
  const ownedCount = await contract.ownedVoiceCount(adress, voiceId);
  return ownedCount.toNumber();
}

export async function getAuthKey(address: string) {
  const authKey = `authKey-${randomUUID()}`;
  await prisma.walletAuthKey.upsert({
    where: { address },
    create: { address, authKey },
    update: { authKey },
  });
  return authKey;
}

export async function verifyAddress(address: string, signature: string) {
  const authInfo = await prisma.walletAuthKey.findFirst({
    where: {
      address,
      createdAt: { gte: new Date(Date.now() - 1000 * 60 * 10) },
    },
  });
  if (!authInfo) return false;
  await prisma.walletAuthKey.delete({ where: { address } });
  const signer = ethers.utils.verifyMessage(authInfo.authKey, signature);
  return signer === address;
}

// debug code
// import dotenv from "dotenv";
// dotenv.config();
// async function main() {
//   const tokenUrl = await createTokenUrl({
//     name: "test voice token2",
//     description: "test",
//     image: "https://avatars.githubusercontent.com/u/11766432?v=4",
//   });

//   const result = await mint(
//     "0x4a8fdC7086552f7E4605168586A93Adc267dca81",
//     tokenUrl,
//     1000
//   );
//   console.log(result);
// }

// main();
