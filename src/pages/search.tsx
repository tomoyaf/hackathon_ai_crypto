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
      <p>声モデルを検索</p>
    </Box>
  );
}

SearchPage.getLayout = (page: any) => <Layout>{page}</Layout>;
