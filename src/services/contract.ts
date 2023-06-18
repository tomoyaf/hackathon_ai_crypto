import { randomUUID } from "node:crypto";
import { uploadFile } from "../utils/storage";
import { ethers } from "ethers";
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
    process.env.CHAIN_RPC_URL || ""
  );

  const ownerWallet = new ethers.Wallet(
    process.env.OWNER_PRIVATE_KEY || "",
    provider
  );

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS || "",
    compiledInfo.abi,
    ownerWallet
  ) as VoiceTokenType;

  return { contract, ownerWallet, provider };
}

// 音声販売者が音声モデルをサービス、コントラクト両方に登録後、metadataを登録して販売可能にする
export async function acceptAddMintableItem(
  voiceId: number,
  metadataUrl: string
) {
  const { contract } = await connectContract();
  const tx = await contract.acceptAddMintableItem(voiceId, metadataUrl);
  await tx.wait();
}

// 販売可能に出来なかった場合、承認待ち情報を削除して登録料を返金する
export async function refund(voiceId: number) {
  const { contract } = await connectContract();
  const [addItemPrice] = await contract.getCurrentSetting();
  const tx = await contract.refundAddMintableItemFee(voiceId, {
    value: addItemPrice,
  });
  await tx.wait();
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
