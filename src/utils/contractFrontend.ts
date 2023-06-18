import { ethers } from "ethers";
// smart-contract フォルダ内でnpm run compileを実行してください
import compiledInfo from "../../smart-contract/artifacts/contracts/VoiceToken.sol/VoiceToken.json";
import { VoiceToken } from "../../smart-contract/typechain-types";

export const CONTRACT_ADDRESS = "0xD6d5dBABDF3F125CBfab0DDcD5bFB5c930FB45C3";
export const ADD_ITEM_PRICE = ethers.utils.parseEther("0.5"); // 0.5 MATIC
const CHAIN_RPC_URL = "https://matic-mumbai.chainstacklabs.com";

export type VoiceTokenType = Omit<VoiceToken, keyof ethers.BaseContract> &
  ethers.Contract;

// transactionが発生しない参照系コントラクト問い合わせの際に使う
export function createReadOnlyProvider() {
  return new ethers.providers.JsonRpcProvider(CHAIN_RPC_URL);
}

// metamaskと接続して、providerとaccountsを返す
export async function createMetaMaskProvider(
  providerSrc:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
) {
  const provider = new ethers.providers.Web3Provider(providerSrc);
  const accounts = await provider.send("eth_requestAccounts", []);
  return { provider, accounts };
}

export function connectContract(
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
): VoiceTokenType {
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    compiledInfo.abi,
    signer
  ) as VoiceTokenType;
  return contract as VoiceTokenType;
}

export function extractVoiceIdFromTxResult(
  receipt: ethers.ContractReceipt
): number | undefined {
  const voiceId = receipt.events?.find(
    (e) => e.event === "SuccessRequestAddItem"
  )?.args?.[1];

  // BigNumberをnumberに変換する
  return voiceId ? +voiceId.toString() : undefined;
}
