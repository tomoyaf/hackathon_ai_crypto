import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { k } from "@kuma-ui/core";
import { Header, BottomNav, Layout } from "@/components";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar"
      height="100vh"
      style={{ overflowY: "scroll" }}
    >
      <p>サンプル曲をリスト表示して再生できる</p>
      <p>声リンクをクリックで声詳細ページに遷移</p>
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
