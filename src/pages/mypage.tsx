/* eslint-disable @next/next/no-img-element */
import { css, k, styled } from "@kuma-ui/core";
import { Layout } from "@/components";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import {
  Music,
  MusicEvaluation,
  OriginalMusic,
  User,
  UserVoiceModelPurchase,
  VoiceModel,
} from "@prisma/client";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/card";
import { useMetaMask } from "@/hooks/useContract";
import type { Nft } from "alchemy-sdk";

export default function IndexPage() {
  const { status, data: session } = useSession();
  const { getOwnedNFTs } = useMetaMask();
  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const { data: myInfo } = useSWR<
    | (User & {
        userVoiceModelPurchases: (UserVoiceModelPurchase & {
          voiceModel: VoiceModel;
        })[];
        voiceModels: VoiceModel[];
        originalMusics: OriginalMusic[];
        musicEvaluations: (MusicEvaluation & { music: Music })[];
      })
    | null
  >("/api/users/me", (url: string) => fetch(url).then((res) => res.json()));

  const [selectedTab, setSelectedTab] = React.useState(0);
  const tabs = [
    { label: "NFT" },
    { label: "声モデル" },
    { label: "投稿曲" },
    { label: "高評価した曲" },
  ] as const;

  const [ownedNfts, setOwnedNfts] = React.useState<Nft[]>([]);
  React.useEffect(() => {
    (async () => {
      const ownedNfts = await getOwnedNFTs();
      setOwnedNfts(ownedNfts.nfts);
    })().catch(console.error);
  }, []);

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
    >
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
          maxWidth="1200px"
          m="0 auto"
          gap="24px"
          flexWrap="wrap"
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
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? ""}
            />
          </k.div>
          <k.div display="flex" justify="center" flexDir="column" zIndex="1">
            <k.h1 fontSize="3rem" color="white" fontWeight={900}>
              {session?.user?.name}
            </k.h1>
          </k.div>
          <k.div
            position="absolute"
            right="24px"
            bottom="16px"
            display="flex"
            flexDir="column"
            gap="12px"
          >
            <k.button
              onClick={() => signOut()}
              fontSize="0.85rem"
              display="flex"
              gap="4px"
              color="#35d0ac"
            >
              ログアウト
            </k.button>
            <k.a
              href="https://forms.gle/qCef4L3zN1fWUvPMA"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="0.85rem"
              display="flex"
              gap="4px"
              color="#35d0ac"
            >
              削除依頼
              <ArrowTopRightOnSquareIcon width="15px" />
            </k.a>
          </k.div>
        </k.div>
      </Upper>

      <k.div
        width="1200px"
        maxWidth="100%"
        display="flex"
        flexDir="column"
        m="36px auto 120px"
        p="0 24px"
        gap="36px"
      >
        <k.div
          width="100%"
          display="flex"
          flexWrap="wrap"
          gap="28px"
          alignItems="flex-end"
        >
          {tabs.map((tab, index) => (
            <k.button
              key={tab.label}
              onClick={() => setSelectedTab(index)}
              fontSize="1.5rem"
              fontWeight="900"
              transition="color ease 300ms"
              style={{
                textUnderlineOffset: "6px",
                color: index === selectedTab ? "#f81c55" : "white",
                textDecoration: index === selectedTab ? "underline" : "none",
              }}
            >
              {tab.label}
            </k.button>
          ))}
        </k.div>

        {tabs.findIndex((tab) => tab.label === "NFT") === selectedTab && (
          <k.div width="100%" display="flex" flexWrap="wrap" gap="36px">
            {(ownedNfts.length ?? 0) === 0 ? (
              <k.div fontSize="1.2rem" color="#bbb" lineHeight="2.6rem">
                <k.p>まだ声モデルを購入していないようです。</k.p>
                <k.p>
                  声モデルをNFTとして購入することで、その声を自由に使用できるようになります！
                </k.p>
                <k.div
                  borderStyle="solid"
                  borderWidth="1px"
                  borderColor="#bbb"
                  width="fit-content"
                  borderRadius="4px"
                  p="4px 24px"
                  m="20px 0 0"
                >
                  <Link href="/voices" style={{ display: "flex", gap: "12px" }}>
                    声モデルを購入する
                    <ArrowRightIcon width="24px" />
                  </Link>
                </k.div>
              </k.div>
            ) : (
              ownedNfts.map((nft) => (
                <Card
                  key={nft.tokenId}
                  href={`/voices/${nft.tokenId}/nft`}
                  imageUrl={nft.rawMetadata?.image || ""}
                  title={nft.rawMetadata?.title || ""}
                  description={nft.rawMetadata?.description || ""}
                />
              ))
            )}
          </k.div>
        )}

        {tabs.findIndex((tab) => tab.label === "声モデル") === selectedTab && (
          <k.div width="100%" display="flex" flexWrap="wrap" gap="36px">
            {(myInfo?.voiceModels.length ?? 0) === 0 ? (
              <k.div fontSize="1.2rem" color="#bbb" lineHeight="2.6rem">
                <k.p>まだ声モデルを投稿していないようです。</k.p>
                <k.p>
                  声をNFTとして投稿することで、世界中のクリエイターにあなたの声を解放してみましょう！
                </k.p>
                <k.div
                  borderStyle="solid"
                  borderWidth="1px"
                  borderColor="#bbb"
                  width="fit-content"
                  borderRadius="4px"
                  p="4px 24px"
                  m="20px 0 0"
                >
                  <Link href="/post" style={{ display: "flex", gap: "12px" }}>
                    声モデルを投稿する
                    <ArrowRightIcon width="24px" />
                  </Link>
                </k.div>
              </k.div>
            ) : (
              myInfo?.voiceModels.map((voiceModel) => (
                <Card
                  href={`/voices/${voiceModel.id}`}
                  imageUrl={voiceModel.thumbnailUrl}
                  title={voiceModel.title}
                  description={voiceModel.description}
                />
              ))
            )}
          </k.div>
        )}

        {tabs.findIndex((tab) => tab.label === "投稿曲") === selectedTab && (
          <k.div width="100%" display="flex" flexWrap="wrap" gap="36px">
            {(myInfo?.originalMusics.length ?? 0) === 0 ? (
              <k.div fontSize="1.2rem" color="#bbb" lineHeight="2.6rem">
                <k.p>まだ曲を投稿していないようです。</k.p>
                <k.p>
                  曲を投稿して、世界中のクリエイターの声で無限の可能性を解放してみましょう！
                </k.p>
                <k.div
                  borderStyle="solid"
                  borderWidth="1px"
                  borderColor="#bbb"
                  width="fit-content"
                  borderRadius="4px"
                  p="4px 24px"
                  m="20px 0 0"
                >
                  <Link
                    href="/originalMusics/post"
                    style={{ display: "flex", gap: "12px" }}
                  >
                    曲を投稿する
                    <ArrowRightIcon width="24px" />
                  </Link>
                </k.div>
              </k.div>
            ) : (
              myInfo?.originalMusics.map((originalMusic) => (
                <Card
                  href={`/originalMusics/${originalMusic.id}`}
                  imageUrl={originalMusic.thumbnailUrl}
                  title={originalMusic.title}
                  description={originalMusic.description}
                />
              ))
            )}
          </k.div>
        )}

        {tabs.findIndex((tab) => tab.label === "高評価した曲") ===
          selectedTab && (
          <k.div width="100%" display="flex" flexWrap="wrap" gap="36px">
            {(myInfo?.musicEvaluations.length ?? 0) === 0 ? (
              <k.div fontSize="1.2rem" color="#bbb" lineHeight="2.6rem">
                <k.p>まだ曲を高評価していないようです。</k.p>
                <k.p>曲を聴いて、あなたにぴったりの曲を探しましょう！</k.p>
                <k.div
                  borderStyle="solid"
                  borderWidth="1px"
                  borderColor="#bbb"
                  width="fit-content"
                  borderRadius="4px"
                  p="4px 24px"
                  m="20px 0 0"
                >
                  <Link href="/" style={{ display: "flex", gap: "12px" }}>
                    曲を聴く
                    <ArrowRightIcon width="24px" />
                  </Link>
                </k.div>
              </k.div>
            ) : (
              myInfo?.musicEvaluations.map((musicEvaluation) => (
                <Card
                  href={`/musics/${musicEvaluation.musicId}`}
                  imageUrl={musicEvaluation.music.thumbnailUrl}
                  title={musicEvaluation.music.title}
                  description={musicEvaluation.music.description}
                />
              ))
            )}
          </k.div>
        )}
      </k.div>
    </k.div>
  );
}

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

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
