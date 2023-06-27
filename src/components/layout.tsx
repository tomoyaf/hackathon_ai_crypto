import { styled, k } from "@kuma-ui/core";
import { BottomNav } from "@/components";
import React from "react";
import Head from "next/head";

export const Layout: React.FC<{
  children: React.ReactNode;
  title?: string;
}> = ({
  children,
  title = "VOICE CHAIN | NFTとAIであなたの声を資産にする",
}) => {
  return (
    <Wrapper>
      <Head>
        <title>{title}</title>
      </Head>

      <k.main height="100vh">{children}</k.main>
      <BottomNav />
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  background: rgb(2 6 23 / 1);
  height: 100vh;
  color: rgb(241 245 249 / 1);
  position: relative;
  overflow-y: scroll;
`;
