import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { k } from "@kuma-ui/core";
import { Header, BottomNav, Layout, ListItem } from "@/components";
import useSWR from "swr";
import { Music, VoiceModel } from "@prisma/client";

export default function IndexPage() {
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  const { data } = useSWR<{
    musics: (Music & { isLiked: boolean; voiceModel: VoiceModel })[];
  }>(`/api/musics`, fetcher);

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
    <k.div>
      <k.div mt="100px"></k.div>

      <k.div
        display="flex"
        flexDir="column"
        alignItems="center"
        bg="linear-gradient(136deg, #0f1724, #05111c)"
        p="36px 0"
      >
        {data?.musics?.map((item, i) => {
          return (
            <ListItem
              music={item}
              updateEvaluation={updateEvaluation(item.id)}
              key={i}
            />
          );
        })}
      </k.div>
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
