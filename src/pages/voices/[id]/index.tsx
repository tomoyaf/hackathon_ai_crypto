import { Box } from "@chakra-ui/react";
import { Layout } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <Box
      className="snap-y snap-mandatory hidden-scrollbar"
      h="100vh"
      overflowY="scroll"
    >
      <p>声詳細ページ</p>
      <p>声NFTを購入することができる</p>
      <p>eth連携してない場合は連携処理する</p>
    </Box>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
