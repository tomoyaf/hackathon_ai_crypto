import { useEffect, useRef } from "react";
import { ethers } from "ethers";
import * as contractUtils from "@/utils/contractFrontend";

export function useMetaMask() {
  const providerRef = useRef<ethers.providers.Web3Provider>();
  const accountsRef = useRef<string[]>();
  const contractRef = useRef<contractUtils.VoiceTokenType>();

  const connectContract = (
    provider?: ethers.providers.Web3Provider,
    accounts?: string[]
  ) => {
    if (!provider || !accounts?.length) return;
    const _contract = contractUtils.connectContract(provider);
    return _contract;
  };

  const connectToMetaMask = async () => {
    if (
      providerRef.current &&
      accountsRef.current?.length &&
      contractRef.current
    )
      return {
        provider: providerRef.current,
        accounts: accountsRef.current,
        contract: contractRef.current,
      };

    // 接続を初期化する
    if (!window?.ethereum) throw new Error("ウォレットが見つかりませんでした");
    const { provider, accounts } = await contractUtils.createMetaMaskProvider(
      window.ethereum
    );
    providerRef.current = provider;
    accountsRef.current = accounts;
    contractRef.current = connectContract(provider, accounts);
    if (!contractRef.current)
      throw new Error("コントラクトの初期化に失敗しました");
    return { provider, accounts, contract: contractRef.current };
  };

  useEffect(() => {
    window.ethereum?.on("accountsChanged", (_accounts: string[]) => {
      accountsRef.current = _accounts;
      contractRef.current = connectContract(providerRef.current, _accounts);
    });

    return () => {
      window.ethereum?.removeAllListeners("accountsChanged");
    };
  }, []);

  return { connectToMetaMask };
}
