import { Layout } from "@/components";
import { k } from "@kuma-ui/core";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar"
      height="100vh"
      overflow-y="scroll"
    >
      <p>声詳細ページ</p>
      <p>声NFTを購入することができる</p>
      <p>eth連携してない場合は連携処理する</p>
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
