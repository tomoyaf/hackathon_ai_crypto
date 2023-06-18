import { ethers } from "ethers";
// smart-contract フォルダ内でnpm run compileを実行してください
import compiledInfo from "../../smart-contract/artifacts/contracts/VoiceToken.sol/VoiceToken.json";
import { VoiceToken } from "../../smart-contract/typechain-types";

export const CONTRACT_ADDRESS = "0x65048b48FC112FeBF3D5aEC9663E093597415c4c";
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
  signerOrProvider: ethers.providers.Provider | ethers.Signer
): VoiceTokenType {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    compiledInfo.abi,
    signerOrProvider
  ) as VoiceTokenType;
  return contract as VoiceTokenType;
}
