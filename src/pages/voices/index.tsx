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
      <p>ボイスを一覧で表示できる</p>
    </Box>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
