import { ethers } from "ethers";
// smart-contract フォルダ内でnpm run compileを実行してください
import compiledInfo from "../../smart-contract/artifacts/contracts/VoiceToken.sol/VoiceToken.json";
import { VoiceToken } from "../../smart-contract/typechain-types";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export type VoiceTokenType = Omit<VoiceToken, keyof ethers.BaseContract> &
  ethers.Contract;

// transactionが発生しない参照系コントラクト問い合わせの際に使う
export function createReadOnlyProvider() {
  return new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_CHAIN_RPC_URL || ""
  );
}

// metamaskと接続して、providerとaccountsを返す
export async function createMetaMaskProvider(
  providerSrc:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc
) {
  const provider = new ethers.providers.Web3Provider(providerSrc);
  const accounts: string[] = await provider.send("eth_requestAccounts", []);
  return { provider, accounts };
}

export function connectContract(
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
): VoiceTokenType {
  const signerOrProvider =
    provider instanceof ethers.providers.Web3Provider
      ? provider.getSigner()
      : provider;
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    compiledInfo.abi,
    signerOrProvider
  ) as VoiceTokenType;
  return contract as VoiceTokenType;
}

export function changeProvider(
  contract: VoiceTokenType,
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
) {
  const signerOrProvider =
    provider instanceof ethers.providers.Web3Provider
      ? provider.getSigner()
      : provider;
  return contract.connect(signerOrProvider) as VoiceTokenType;
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
