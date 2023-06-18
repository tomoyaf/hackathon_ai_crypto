/* eslint-disable @next/next/no-img-element */
import { css, k, styled } from "@kuma-ui/core";
import { Layout } from "@/components";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import useSWR from "swr";
import {
  MusicEvaluation,
  OriginalMusic,
  User,
  VoiceModel,
} from "@prisma/client";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function IndexPage() {
  const { status, data: session } = useSession();
  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const { data: myInfo } = useSWR<
    | (User & {
        voiceModels: VoiceModel[];
        originalMusics: OriginalMusic[];
        musicEvaluations: MusicEvaluation[];
      })
    | null
  >("/api/users/me", (url: string) => fetch(url).then((res) => res.json()));

  const [selectedTab, setSelectedTab] = React.useState(0);
  const tabs = [
    { label: "声モデル" },
    { label: "投稿曲" },
    { label: "高評価した曲" },
  ];

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
    >
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
                <Link href={`/voices/${voiceModel.id}`}>
                  <k.div
                    width="250px"
                    height="300px"
                    overflow="hidden"
                    borderRadius="4px"
                    display="flex"
                    flexDir="column"
                    bg="linear-gradient(175deg, rgb(51 85 102) 0%, rgb(3 14 36) 100%)"
                  >
                    <k.img
                      src={voiceModel.thumbnailUrl}
                      width="250px"
                      height="200px"
                      style={{ objectFit: "cover" }}
                    />
                    <k.div m="12px 0 0" p="0 12px">
                      {voiceModel.title}
                    </k.div>
                    <k.div color="#bbb" p="0 12px" fontSize="0.85rem">
                      {voiceModel.description}
                    </k.div>
                  </k.div>
                </Link>
              ))
            )}
          </k.div>
        )}

        {tabs.findIndex((tab) => tab.label === "投稿曲") === selectedTab && (
          <k.div width="100%" display="flex" flexWrap="wrap" gap="36px">
            {(myInfo?.originalMusics.length ?? 0) === 0 ? (
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
              myInfo?.originalMusics.map((originalMusic) => (
                <Link href={`/originalMusics/${originalMusic.id}`}>
                  <k.div
                    width="250px"
                    height="300px"
                    overflow="hidden"
                    borderRadius="4px"
                    display="flex"
                    flexDir="column"
                    bg="linear-gradient(175deg, rgb(51 85 102) 0%, rgb(3 14 36) 100%)"
                  >
                    <k.img
                      src={originalMusic.url}
                      width="250px"
                      height="200px"
                      style={{ objectFit: "cover" }}
                    />
                    <k.div m="12px 0 0" p="0 12px">
                      {originalMusic.title}
                    </k.div>
                    <k.div color="#bbb" p="0 12px" fontSize="0.85rem">
                      {originalMusic.description}
                    </k.div>
                  </k.div>
                </Link>
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
  padding: 0px 24px 24px;
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
