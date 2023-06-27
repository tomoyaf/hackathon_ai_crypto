import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { k } from "@kuma-ui/core";
import Link from "next/link";
import React from "react";

export type IntroCardProps = {};

export const IntroCard: React.FC<IntroCardProps> = (props) => {
  return (
    <k.div
      display="flex"
      justify="flex-start"
      alignItems="center"
      p="32px calc(60vw - 300px)"
      gap="76px"
      overflow="scroll"
      style={{ scrollSnapType: "x mandatory" }}
    >
      <Link
        href="/about"
        style={{ scrollSnapAlign: "center", marginLeft: "20vw" }}
      >
        <k.div
          borderRadius="12px"
          width="600px"
          maxWidth="90vw"
          bg="linear-gradient(175deg, #d2144e 0%, #a3193f 100%)"
          p="22px 36px"
          transition="opacity 220ms ease"
          boxShadow="0 2px 24px rgba(190, 22, 72, 0.8)"
          _hover={{
            opacity: 0.7,
          }}
        >
          <k.h1 fontSize="2rem" fontWeight="900">
            VOICE CHAIN（β）へようこそ！
          </k.h1>

          <k.div fontSize="0.85rem" lineHeight="2rem" mt="6px">
            あなたの声を最新のAIで学習し、誰の声でも簡単にあなたの声に変換することができます。
            この声変換AIをNFTにして、世界中のクリエイターに発信しましょう！
          </k.div>
          <k.div fontSize="0.85rem" lineHeight="2rem">
            クリエイターは自分の好きな声を法律を守りながら利用することができます。
          </k.div>
          <k.div fontSize="0.85rem" lineHeight="2rem">
            （β版としてテストネットワークで運用しております。）
          </k.div>
          <k.div
            fontSize="0.85rem"
            lineHeight="2rem"
            display="flex"
            justify="center"
            alignItems="center"
            mt="12px"
            fontWeight="900"
            gap="8px"
          >
            詳細はこちら
            <ArrowRightIcon width="20px" />
          </k.div>
        </k.div>
      </Link>

      <Link href="/about" style={{ scrollSnapAlign: "center" }}>
        <k.div
          borderRadius="12px"
          width="600px"
          maxWidth="90vw"
          bg="linear-gradient(175deg, #2ec7a4 0%, #2bb997 100%)"
          p="22px 36px"
          transition="opacity 220ms ease"
          boxShadow="0 2px 24px #35d0ac55"
          _hover={{
            opacity: 0.7,
          }}
        >
          <k.h1 fontSize="2rem" fontWeight="900">
            AIもNFTも私たちが無料で対応！
          </k.h1>
          <k.div fontSize="0.85rem" lineHeight="2rem" mt="6px">
            投稿フォームから必要事項を埋めていただければVOICE
            CHAIN運営が無料でAI学習も、NFT作成処理も対応します！
          </k.div>
          <k.div fontSize="0.85rem" lineHeight="2rem">
            AI、NFTの細かい話は弊社営業とご相談いただけます！
          </k.div>
          <k.div
            fontSize="0.85rem"
            lineHeight="2rem"
            display="flex"
            justify="center"
            alignItems="center"
            mt="12px"
            fontWeight="900"
            gap="8px"
          >
            詳細はこちら
            <ArrowRightIcon width="20px" />
          </k.div>
        </k.div>
      </Link>

      <Link
        href="/about"
        style={{ scrollSnapAlign: "center", marginRight: "20vw" }}
      >
        <k.div
          borderRadius="12px"
          width="600px"
          maxWidth="90vw"
          bg="linear-gradient(175deg, #1752e4 0%, #0a2464 100%)"
          p="22px 36px"
          transition="opacity 220ms ease"
          boxShadow="0 2px 24px #1752e45a"
          _hover={{
            opacity: 0.7,
          }}
        >
          <k.h1 fontSize="2rem" fontWeight="900">
            声を資産に
          </k.h1>

          <k.div fontSize="0.85rem" lineHeight="2rem" mt="6px">
            あなたの声モデルNFTは売却時に利益を得るだけではなく、二次流通の取引でも一定料率で還元があります。
          </k.div>
          <k.div fontSize="0.85rem" lineHeight="2rem">
            そして、販売価格も二次流通還元率も自由に設定することができます。
          </k.div>
          <k.div
            fontSize="0.85rem"
            lineHeight="2rem"
            display="flex"
            justify="center"
            alignItems="center"
            mt="12px"
            fontWeight="900"
            gap="8px"
          >
            詳細はこちら
            <ArrowRightIcon width="20px" />
          </k.div>
        </k.div>
      </Link>
    </k.div>
  );
};
