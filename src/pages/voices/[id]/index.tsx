"use client";
import { Layout, ListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import { useMetaMask } from "@/hooks/useContract";
import * as contractUtils from "@/utils/contractFrontend";
import { utils, ContractReceipt } from "ethers";
import React from "react";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { VoiceModel, Music } from "@prisma/client";

type VoiceModelWithMusics = VoiceModel & {
  musics: (Music & { isLiked: boolean; voiceModel: VoiceModel })[];
};

export default function IndexPage() {
  const router = useRouter();
  const readOnlyContract = contractUtils.connectReadOnlyContract();
  const { connectToMetaMask } = useMetaMask();
  const { id } = router.query;
  const { data } = useSWR<VoiceModelWithMusics>(
    `/api/voiceModels/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  // 値段取得処理
  const [isSoldOut, setIsSoldOut] = React.useState(false);
  const [price, setPrice] = React.useState("");
  React.useEffect(() => {
    (async () => {
      if (!data?.voiceId) return;
      const [currentSoldCount, maxSupply, isUnlimitedSupply] =
        await readOnlyContract.getMintableCount(data?.voiceId);

      const isMintable = isUnlimitedSupply || currentSoldCount < maxSupply;
      setIsSoldOut(isMintable);

      if (!isMintable) return;
      const price = await readOnlyContract.getMintPrice(data?.voiceId);
      setPrice(utils.formatEther(price));
    })();
  }, [data?.voiceId]);

  // 購入処理
  const [mintedResult, setMintedResult] = React.useState<{
    receipt: ContractReceipt;
    tokenId?: number;
    voiceId?: number;
  }>();
  const mint = async () => {
    if (!data?.voiceId || isSoldOut) return;
    const { contract: metaMaskContract } = await connectToMetaMask();
    if (!metaMaskContract) {
      toast.error("ウォレットに接続できませんでした");
      return;
    }

    toast.loading("購入処理中...");
    try {
      const selfAddress = await metaMaskContract.signer.getAddress();
      const balance = await metaMaskContract.signer.getBalance();
      const estimatedGas = await readOnlyContract.estimateGas.safeMint(
        selfAddress,
        data.voiceId,
        {
          value: utils.parseEther(price),
        }
      );
      if (balance.lt(estimatedGas.add(utils.parseEther(price)))) {
        toast.error("残高が不足しております");
        return;
      }

      const tx = await metaMaskContract.safeMint(selfAddress, data.voiceId, {
        value: utils.parseEther(price),
      });
      const receipt = await tx.wait();
      const { tokenId } = contractUtils.extractMintedArgsFromTxResult(receipt);
      toast.success("購入しました");

      // トランザクション結果
      console.log(contractUtils.createPolygonScanUrl(receipt.transactionHash));

      setMintedResult({ receipt, tokenId, voiceId: data.voiceId });
    } catch (error) {
      console.error(error);
      toast.error("購入に失敗しました");
    }
  };

  const updateEvaluation = (musicId: string) => (evaluation: number) => {
    fetch(`/api/musics/${musicId}/evaluation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ evaluation }),
    });
  };

  return (
    <k.div display="flex" flexDir="column">
      <Upper>
        <UpperContent className={css({ bgColor: "#32304d" })} />
        <UpperContent
          className={css({
            bg: "linear-gradient(transparent 0,rgba(0,0,0,.5) 100%),url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)",
          })}
        />

        <k.div
          display="flex"
          flexShrink={0}
          width="100%"
          zIndex="1"
          flexDir="row"
          maxWidth="1200px"
          m="0 auto"
          gap="24px"
          style={{
            alignSelf: "flex-end",
          }}
        >
          <k.div>
            <k.img
              height="192px"
              width="192px"
              boxShadow="0 4px 60px rgba(0,0,0,.5)"
              borderRadius="50%"
              src={data?.thumbnailUrl}
              alt={data?.title}
            />
          </k.div>
          <k.div display="flex" justify="center" flexDir="column" zIndex="1">
            <k.h1 fontSize="3rem" color="white" fontWeight={900}>
              {data?.title}
            </k.h1>
            <k.div color="#9f9f9f">{data?.description}</k.div>
            <k.div color="#9f9f9f">{data?.rule}</k.div>
          </k.div>
        </k.div>
      </Upper>

      <k.div mt="50px"></k.div>

      {data?.musics.map((m, i) => {
        return (
          <ListItem
            music={m}
            key={m.id}
            updateEvaluation={updateEvaluation(m.id)}
          />
        );
      })}
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;

const Upper = styled("div")`
  height: 30vh;
  max-height: 400px;
  min-height: 340px;
  color: #fff;
  display: flex;
  max-width: none;
  overflow: hidden;
  position: relative;
  padding: 0px 24px 48px;
`;

const UpperContent = styled("div")`
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;
