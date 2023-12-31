import { Layout, ListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Music, VoiceModel } from "@prisma/client";

export default function IndexPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSWR<Music & { isLiked: boolean; voiceModel: VoiceModel }>(
    id == null ? null : `/api/musics/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

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
          </k.div>
        </k.div>
      </Upper>
      <k.div mt="50px"></k.div>

      {data && (
        <ListItem
          music={data}
          updateEvaluation={updateEvaluation(id as string)}
        />
      )}
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
