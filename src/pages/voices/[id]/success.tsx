import React from "react";
import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
import { useSearchParams } from "next/navigation";
import { createPolygonScanUrl } from "@/utils/contractFrontend";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const tokenId = searchParams?.get("tokenId");
  const txHash = searchParams?.get("txHash");

  return (
    <k.div
      overflow-y="scroll"
      display="flex"
      justify="center"
      alignItems="center"
      flexDir="column"
      p="0 0 20vh"
    >
      <k.div
        display="flex"
        flexDir="column"
        gap="16px"
        width="500px"
        maxWidth="90vw"
        bg="linear-gradient(175deg, rgb(8 37 52) 0%, rgb(3 14 36) 100%)"
        borderRadius="8px"
        p="40px 44px"
        m="10vh 0 0"
      >
        <k.h2 fontSize="1.2rem" fontWeight="bold" display="flex">
          <CheckBadgeIcon width="18px" /> ご購入ありがとうございます！
        </k.h2>

        <k.div>
          <k.p fontSize="0.85rem" opacity="0.7">
            発行したNFTの情報です! ご確認ください。
          </k.p>
        </k.div>

        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">コンタクトアドレス</k.span>
          <k.input
            type="text"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            readOnly
            value={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
          />
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">TokenID</k.span>
          <k.input
            type="text"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            readOnly
            value={tokenId ?? ""}
          />
        </k.div>

        <k.a
          borderRadius="8px"
          bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
          fontWeight="bold"
          transition="opacity ease 220ms"
          m="8px 0 0"
          _hover={{
            opacity: 0.7,
          }}
          p="8px 0"
          textAlign="center"
          href={createPolygonScanUrl(txHash?.toString() ?? "")}
        >
          PolygonScanで確認する
        </k.a>
      </k.div>
    </k.div>
  );
}

SuccessPage.getLayout = (page: any) => <Layout>{page}</Layout>;
