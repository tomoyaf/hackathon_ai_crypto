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
  const { data } = useSWR<{ musics: Music[] }>(`/api/musics`, fetcher);

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
    >
      <k.div mt="100px"></k.div>

      {data?.musics?.map((item, i) => {
        return <ListItem music={item} key={i} />;
      })}
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
