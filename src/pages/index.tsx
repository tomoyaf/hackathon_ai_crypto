import { Box } from "@chakra-ui/react";
import { Layout } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <Box
      className="snap-y snap-mandatory hidden-scrollbar"
      h="100vh"
      overflowY="scroll"
    >
      <p>サンプル曲をリスト表示して再生できる</p>
      <p>声リンクをクリックで声詳細ページに遷移</p>
    </Box>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
