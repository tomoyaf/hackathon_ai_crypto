import { Layout, SongItem } from "@/components";
import { k } from "@kuma-ui/core";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
    ></k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
