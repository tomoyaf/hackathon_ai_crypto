"use client";
import { Layout, ListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import { useMetaMask } from "@/hooks/useContract";
import * as contractUtils from "@/utils/contractFrontend";
import { utils, ContractReceipt, BigNumber } from "ethers";
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
    () => (id ? `/api/voiceModels/${id}` : null),
    (url: string) => fetch(url).then((res) => res.json())
  );

  // 値段取得処理
  const [isBuyable, setIsBuyable] = React.useState(false);
  const [price, setPrice] = React.useState<BigNumber>();
  const priceByMatic = React.useMemo(
    () => (price ? utils.formatEther(price) : ""),
    [price]
  );
  React.useEffect(() => {
    (async () => {
      if (!data?.voiceId) return;
      const [currentSoldCount, maxSupply, isUnlimitedSupply] =
        await readOnlyContract.getMintableCount(data.voiceId);

      const isMintable = isUnlimitedSupply || currentSoldCount < maxSupply;
      setIsBuyable(isMintable);

      if (!isMintable) return;
      const price = await readOnlyContract.getMintPrice(data.voiceId);
      setPrice(price);
    })();
  }, [data?.voiceId]);

  // 購入処理
  const [owned, setOwned] = React.useState(false);
  const [mintedResult, setMintedResult] = React.useState<{
    receipt: ContractReceipt;
    tokenId?: number;
    voiceId?: number;
  }>();
  const mint = async () => {
    if (!data?.voiceId || !isBuyable || !price || owned) return;
    const { contract: metaMaskContract } = await connectToMetaMask();
    if (!metaMaskContract) {
      toast.error("ウォレットに接続できませんでした");
      return;
    }

    const loadingId = toast.loading("購入処理中...");
    try {
      const selfAddress = await metaMaskContract.signer.getAddress();
      const ownedCount = await metaMaskContract.ownedVoiceCount(
        selfAddress,
        data.voiceId
      );
      const _owned = ownedCount.toNumber() > 0;
      setOwned(_owned);
      if (_owned) {
        toast.error("すでに購入済みです");
        return;
      }

      const balance = await metaMaskContract.signer.getBalance();
      const estimatedGas = await readOnlyContract.estimateGas.safeMint(
        selfAddress,
        data.voiceId,
        {
          value: price,
        }
      );

      if (balance.lt(estimatedGas.add(price))) {
        toast.error("残高が不足しております");
        return;
      }

      const tx = await metaMaskContract.safeMint(selfAddress, data.voiceId, {
        value: price,
      });
      const receipt = await tx.wait();
      const { tokenId } = contractUtils.extractMintedArgsFromTxResult(receipt);
      toast.success("購入しました");

      // トランザクション結果
      console.log(contractUtils.createPolygonScanUrl(receipt.transactionHash));
      setOwned(true);
      setMintedResult({ receipt, tokenId, voiceId: data.voiceId });
    } catch (error) {
      console.error(error);
      toast.error("購入に失敗しました");
    } finally {
      toast.dismiss(loadingId);
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

          {isBuyable && !owned && (
            <k.div
              flexGrow="1"
              display="flex"
              justify="flex-end"
              alignItems="flex-end"
              gap="16px"
              flexDir="column"
            >
              <k.button
                boxShadow="0 2px 18px rgb(190 22 72)"
                borderWidth="2px"
                borderStyle="solid"
                borderColor="#c3164a"
                color="#f22e6a"
                display="flex"
                height="fit-content"
                width="fit-content"
                p="24px 40px"
                m="0 0 8px"
                borderRadius="8px"
                fontWeight="900"
                transition="opacity ease 220ms"
                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.98) 100%)"
                fontSize="1.2rem"
                onClick={mint}
                _hover={{
                  opacity: 0.7,
                }}
              >
                NFT購入
              </k.button>

              <k.div
                display="flex"
                fontSize="0.85rem"
                color="#bbb"
                lineHeight="1.5rem"
                textAlign="right"
              >
                声を変換できるRVCという機械学習モデルです。
                <br />
                どのような声か確認し、気に入ったら購入してみましょう！
              </k.div>

              <k.div display="flex" fontSize="0.85rem">
                <k.a
                  href="https://tomoyaf.notion.site/f3293a74f8c04258b77e31aebbb6b5cc?pvs=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  display="flex"
                  gap="4px"
                  color="#35d0ac"
                >
                  利用規約
                </k.a>
                ,
                <k.a
                  href="https://tomoyaf.notion.site/b1a2a24573414bb19693b33c2806e3c7?pvs=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  display="flex"
                  gap="4px"
                  color="#35d0ac"
                >
                  プライバシーポリシー
                </k.a>
              </k.div>
            </k.div>
          )}

          {owned && (
            <k.button
              boxShadow="0 2px 18px rgb(190 22 72)"
              borderWidth="2px"
              borderStyle="solid"
              borderColor="#c3164a"
              color="#f22e6a"
              display="flex"
              height="fit-content"
              width="fit-content"
              p="24px 40px"
              m="0 0 8px"
              borderRadius="8px"
              fontWeight="900"
              transition="opacity ease 220ms"
              bg="linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.98) 100%)"
              fontSize="1.2rem"
              _hover={{
                opacity: 0.7,
              }}
            >
              購入済み
            </k.button>
          )}
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
