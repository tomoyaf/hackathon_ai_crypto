import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
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
      <p>声NFT証明ページ</p>
      <p>誰が持っているかを証明することができるカッコイイデザインのページ</p>
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
