"use client";
import React from "react";
import { Layout, ListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import { useMetaMask } from "@/hooks/useContract";
import useSWR from "swr";
import { useRouter } from "next/router";
import { VoiceModel, Music } from "@prisma/client";

type VoiceModelWithMusics = VoiceModel & {
  musics: (Music & { isLiked: boolean; voiceModel: VoiceModel })[];
};

export default function IndexPage() {
  const router = useRouter();
  // const { provider, accounts, connectToMetaMask } = useMetaMask();
  // connectToMetaMask();
  // metamask連携が出来ない場合は、read only providerを使う
  const { id } = router.query;
  const { data } = useSWR<VoiceModelWithMusics>(
    `/api/voiceModels/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  const [isOwner, setIsOwner] = React.useState(true);

  // const [isSoldOut, setIsSoldOut] = React.useState(false);
  // const [price, setPrice] = React.useState("");

  // React.useEffect(() => {
  //   (async () => {
  //     console.log({ contract, data });

  //     if (!contract || !data?.voiceId) return;
  //     const [currentSoldCount, maxSupply, isUnlimitedSupply] =
  //       await contract.getMintableCount(data?.voiceId);

  //     console.log(currentSoldCount, maxSupply, isUnlimitedSupply);

  //     const isMintable = isUnlimitedSupply || currentSoldCount < maxSupply;
  //     setIsSoldOut(isMintable);

  //     if (accounts == null || accounts.length === 0 || data?.voiceId == null) {
  //       console.log(JSON.stringify({ accounts, data }));
  //       return;
  //     }

  //     const tokenId = await contract.hasOwnedVoiceId(
  //       accounts[0],
  //       data.voiceId + 100
  //     );

  //     console.log(JSON.stringify({ accounts, data, tokenId }));
  //   })();
  // }, [contract, data?.voiceId]);

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
          maxWidth="1000px"
          m="0 auto"
          gap="24px"
          alignItems="center"
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
          {isOwner && (
            <k.div flexGrow="1" display="flex" justify="flex-end">
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
                borderRadius="8px"
                fontWeight="900"
                transition="opacity ease 220ms"
                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.98) 100%)"
                fontSize="1.2rem"
                _hover={{
                  opacity: 0.7,
                }}
              >
                RVCモデルダウンロード
              </k.button>
            </k.div>
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
