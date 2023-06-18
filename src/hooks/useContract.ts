import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import * as contractUtils from "@/utils/contractFrontend";

export function useMetaMask() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [accounts, setAccounts] = useState<string[]>();

  const connectToMetaMask = () => {
    useEffect(() => {
      if (window.ethereum) {
        contractUtils
          .createMetaMaskProvider(window.ethereum)
          .then(({ provider, accounts }) => {
            setProvider(provider);
            setAccounts(accounts);
          });

        window.ethereum.on("accountsChanged", (_accounts: string[]) => {
          if (accounts?.every((account) => _accounts.includes(account))) return;
          setAccounts(_accounts);
        });
      }

      return () => {
        if (window.ethereum) {
          window.ethereum.removeAllListeners("accountsChanged");
        }
      };
    }, []);
  };

  return { provider, accounts, connectToMetaMask };
}

export function useReadOnlyProvider() {
  const provider = useMemo(() => contractUtils.createReadOnlyProvider(), []);
  return { provider };
}

export function useContract(
  provider?: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
  accounts?: string[]
) {
  const [contract, setContract] = useState<contractUtils.VoiceTokenType>();

  useEffect(() => {
    if (!provider || contract?.provider === provider) return;
    if (provider instanceof ethers.providers.Web3Provider && accounts?.length) {
      const _contract = contract
        ? contractUtils.changeProvider(contract, provider)
        : contractUtils.connectContract(provider);
      setContract(_contract);
    } else if (provider instanceof ethers.providers.JsonRpcProvider) {
      const _contract = contract
        ? contractUtils.changeProvider(contract, provider)
        : contractUtils.connectContract(provider);
      setContract(_contract);
    }
  }, [provider, accounts]);

  const changeProvider = (
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  ) => {
    if (!contract) return;
    contractUtils.changeProvider(contract, provider);
  };

  return { contract, changeProvider };
}
