import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";

export default function SearchPage() {
  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar"
      height="100vh"
      overflow-y="scroll"
    >
      <p>声モデルを検索</p>
    </k.div>
  );
}

SearchPage.getLayout = (page: any) => <Layout>{page}</Layout>;
