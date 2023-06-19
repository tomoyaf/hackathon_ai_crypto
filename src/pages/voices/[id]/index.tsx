"use client";
import { Layout, ListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import { useReadOnlyProvider, useContract } from "@/hooks/useContract";
import { utils } from "ethers";
import React from "react";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";
import { useRouter } from "next/router";
import { VoiceModel, Music } from "@prisma/client";

type VoiceModelWithMusics = VoiceModel & {
  musics: (Music & { isLiked: boolean; voiceModel: VoiceModel })[];
};

export default function IndexPage() {
  const router = useRouter();
  const { provider: readOnlyProvider } = useReadOnlyProvider();
  // metamask連携が出来ない場合は、read only providerを使う
  const { contract } = useContract(readOnlyProvider);
  const { id } = router.query;
  const { data } = useSWR<VoiceModelWithMusics>(
    `/api/voiceModels/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  const [isSoldOut, setIsSoldOut] = React.useState(false);
  const [price, setPrice] = React.useState("");
  React.useEffect(() => {
    (async () => {
      if (!contract || !data?.voiceId) return;
      const [currentSoldCount, maxSupply, isUnlimitedSupply] =
        await contract.getMintableCount(data?.voiceId);

      console.log(currentSoldCount, maxSupply, isUnlimitedSupply);

      const isMintable = isUnlimitedSupply || currentSoldCount < maxSupply;
      setIsSoldOut(isMintable);

      if (!isMintable) return;
      const price = await contract.getMintPrice(data?.voiceId);
      console.log(utils.formatEther(price));
      setPrice(utils.formatEther(price));
    })();
  }, [contract, data?.voiceId]);

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
