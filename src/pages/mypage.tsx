/* eslint-disable @next/next/no-img-element */
import { Box } from "@chakra-ui/react";
import { Layout } from "@/components";
import React from "react";
import { signIn, useSession } from "next-auth/react";

export default function IndexPage() {
  const { status, data: session } = useSession();
  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      w="100vw"
      overflowWrap="anywhere"
      padding="48px 16px"
    >
      {JSON.stringify(session?.user ?? "")}
      <img src={session?.user?.image ?? ""} alt="user avatar" width="100" />

      <p>自分が持っているNFTリスト</p>
      <p>自分が投稿した声リスト</p>
    </Box>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
