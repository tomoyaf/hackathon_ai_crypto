"use client";
import React from "react";
import { Layout, ListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import { useMetaMask } from "@/hooks/useContract";
import useSWR from "swr";
import { useRouter } from "next/router";
import { VoiceModel, Music } from "@prisma/client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

type VoiceModelWithMusics = VoiceModel & {
  musics: (Music & { isLiked: boolean; voiceModel: VoiceModel })[];
};

export default function IndexPage() {
  const router = useRouter();
  const { createAuthSignature } = useMetaMask();
  const { id: voiceId } = router.query;
  const { data } = useSWR<VoiceModelWithMusics>(
    () => (voiceId ? `/api/voiceModels/nft/${voiceId}` : null),
    (url: string) => fetch(url).then((res) => res.json())
  );

  const _downloadModel = async () => {
    const { signature, address } = await createAuthSignature();
    const res = await fetch(`/api/voiceModels/${voiceId}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signature, address }),
    });
    const { modelDownloadUrl } = await res.json();
    if (!modelDownloadUrl) throw new Error("認証に失敗しました");
    return modelDownloadUrl as string;
  };

  const [downloadModelUrl, setDownloadModelUrl] = React.useState("");
  const downloadModel = async () => {
    try {
      const modelDownloadUrl = await toast.promise(_downloadModel(), {
        loading: "所有権を確認しています...",
        success: "所有権を確認しました。ダウンロードを開始します。",
        error: "所有権を確認できませんでした。",
      });

      setDownloadModelUrl(modelDownloadUrl);
      location.assign(modelDownloadUrl);
    } catch (error) {
      console.error(error);
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
            bg: "linear-gradient(transparent 0,rgba(0,0,0,.5) 100%)",
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
          <k.div
            flexGrow="1"
            display="flex"
            alignItems="flex-end"
            flexDir="column"
            gap="24px"
          >
            {downloadModelUrl ? (
              <k.a
                href={downloadModelUrl}
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
                download
              >
                RVCモデルダウンロード
              </k.a>
            ) : (
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
                onClick={downloadModel}
              >
                RVCモデルダウンロード
              </k.button>
            )}

            <k.a
              href="https://forms.gle/gVfKAuZ6u8VjeXDs9"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="0.85rem"
              display="flex"
              gap="4px"
              color="#35d0ac"
            >
              声変換代行サービス依頼フォーム
              <ArrowTopRightOnSquareIcon width="15px" />
            </k.a>
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
