import { Alchemy, Network } from "alchemy-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MUMBAI,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return;
  if (req.query.address == null) {
    res.status(400).json({ message: "不正なリクエストです。" });
    return;
  }

  const nfts = await alchemy.nft.getNftsForOwner(req.query.address as string);
  nfts.ownedNfts[0].contract;
  const ownedNfts = nfts.ownedNfts.filter(
    (nft) =>
      nft.contract.address ===
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.toLowerCase()
  );
  res.status(200).json({ ownedNfts });
}
