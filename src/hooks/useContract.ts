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

// export function useContract(provider?: ethers.providers.Web3Provider) {
//   const [contract, setContract] = useState<contractUtils.VoiceTokenType>();

//   useEffect(() => {
//     if (provider) setContract(contractUtils.connectContract(provider));
//   }, [provider]);

//   return contract;
// }
