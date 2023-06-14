/* eslint-disable @next/next/no-img-element */
import { k } from "@kuma-ui/core";
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
    <k.div
      display="flex"
      flex-direction="column"
      width="100vw"
      overflow-wrap="anywhere"
      p="48px 16px"
    >
      {JSON.stringify(session?.user ?? "")}
      <img src={session?.user?.image ?? ""} alt="user avatar" width="100" />

      <p>自分が持っているNFTリスト</p>
      <p>自分が投稿した声リスト</p>
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
