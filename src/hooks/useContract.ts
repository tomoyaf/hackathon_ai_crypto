import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import * as contractUtils from "@/utils/contractFrontend";

export function useMetaMask() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>();

  const connectContract = (
    provider?: ethers.providers.Web3Provider,
    accounts?: string[]
  ) => {
    if (!provider || !accounts?.length) return;
    const _contract = contractUtils.connectContract(provider);
    return _contract;
  };

  useEffect(() => {
    window.ethereum?.on("accountsChanged", (_accounts: string[]) => {
      if (accounts?.every((account) => _accounts.includes(account))) return;
      setAccounts(_accounts);
      connectContract(provider, _accounts);
    });

    return () => {
      window.ethereum?.removeAllListeners("accountsChanged");
    };
  }, []);

  const connectToMetaMask = useCallback(async () => {
    const { _provider, _accounts } = await (async () => {
      if (provider && accounts?.length)
        return { _provider: provider, _accounts: accounts };
      if (!window?.ethereum)
        throw new Error("ウォレットとの接続に失敗しました");
      const { provider: newProvider, accounts: newAccounts } =
        await contractUtils.createMetaMaskProvider(window.ethereum);

      if (!newAccounts?.length)
        throw new Error("ウォレットアカウントの接続に失敗しました");
      setProvider(newProvider);
      setAccounts(newAccounts);
      return { _provider: newProvider, _accounts: newAccounts };
    })();

    const contract = connectContract(_provider, _accounts);
    return { provider, accounts, contract };
  }, [provider, accounts]);

  return { connectToMetaMask, provider, accounts };
}
