import { k } from "@kuma-ui/core";
import { Layout, SongItem } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
    >
      <k.div mt="100px"></k.div>
      {[...Array(50)].map((k, i) => {
        return <SongItem key={i} index={i + 1} />;
      })}
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
