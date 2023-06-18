import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { k } from "@kuma-ui/core";
import { Header, BottomNav, Layout, ListItem } from "@/components";
import useSWR from "swr";
import { Music } from "@prisma/client";
import { usePlayer } from "@/hooks/usePlayer";

export default function IndexPage() {
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  const { data } = useSWR<{ musics: (Music & { isLiked: boolean })[] }>(
    `/api/musics`,
    fetcher
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
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
      width="600px"
      maxWidth="calc(100vw - 12px)"
    >
      <k.div mt="100px"></k.div>

      <k.div display="flex" flexDir="column" alignItems="center">
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
