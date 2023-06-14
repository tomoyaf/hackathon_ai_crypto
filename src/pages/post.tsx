import { Box } from "@chakra-ui/react";
import { Layout } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";

export default function SearchPage() {
  return (
    <Box
      className="snap-y snap-mandatory hidden-scrollbar"
      h="100vh"
      overflowY="scroll"
    >
      <p>eth連携してない場合は連携処理する</p>
      <p>声モデルを投稿</p>
      <p>最小限はRVCモデルファイルだけ投稿だが以下の詳細情報も入れたい</p>
      <p>・タイトル</p>
      <p>・詳細</p>
      <p>・サムネ画像</p>
    </Box>
  );
}

SearchPage.getLayout = (page: any) => <Layout>{page}</Layout>;
