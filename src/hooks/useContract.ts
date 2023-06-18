import { useState, useEffect } from "react";
import { ethers } from "ethers";
import * as contractUtils from "@/utils/contractFrontend";

export function useMetaMask() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>();

  useEffect(() => {
    if (window.ethereum) {
      contractUtils
        .createMetaMaskProvider(window.ethereum)
        .then(({ provider, accounts }) => {
          setProvider(provider);
          setAccounts(accounts);
        });

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccounts(accounts);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return { provider, accounts };
}

export function useContract(provider?: ethers.providers.Web3Provider) {
  const [contract, setContract] = useState<contractUtils.VoiceTokenType>();

  useEffect(() => {
    if (provider) setContract(contractUtils.connectContract(provider));
  }, [provider]);

  return contract;
}

// 使い方メモ
// metamaskを使ってcontractに接続する
// import {useMetaMask, useContract} from "@/hooks/useContract";
// const {provider} = useMetaMask()
// const contract = useContract(provider)

// アカウントを接続しないで、contractに接続する(参照系のみ実行可能)
// import {createReadOnlyProvider} from "@/utils/contractFrontend";
// import {useContract} from "@/hooks/useContract";
// const provider = createReadOnlyProvider()
// const contract = useContract(provider)
