import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { k } from "@kuma-ui/core";
import { Header, BottomNav, Layout, ListItem } from "@/components";

export default function IndexPage() {
  const items = useFeedItems();

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar"
      height="100vh"
      style={{ overflowY: "scroll" }}
    >
      <k.div mt="100px"></k.div>

      {[...Array(50)].map((k, i) => {
        return <ListItem key={i} />;
      })}
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;

const mock = [{}];
