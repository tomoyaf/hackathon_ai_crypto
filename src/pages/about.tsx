import React from "react";
import { k } from "@kuma-ui/core";
import Link from "next/link";

export default function IndexPage() {
  return (
    <k.div width="100%">
      <k.nav
        display="flex"
        justify="center"
        alignItems="center"
        width="100%"
        height="68px"
        px="24px"
        position="fixed"
        top="0"
      >
        <k.p fontSize="1.2rem" fontWeight="900">
          VOICE CHAIN
        </k.p>

        <k.ul
          flexGrow="1"
          display="flex"
          justify="end"
          alignItems="center"
          height="68px"
          fontWeight="900"
          gap="26px"
        >
          <li>TOP</li>
          <li>AI + NFT</li>
          <li>VOICE</li>
          <li>MUSIC CREATORS</li>
          <li>MUSIC LOVERS</li>
        </k.ul>
      </k.nav>

      <k.div
        width="100vw"
        pt="68px"
        display="flex"
        bg="linear-gradient(175deg, #fe6795 0%, #eb4d79 100%)"
      >
        <k.div
          display="flex"
          flexDir="column"
          width="50%"
          pl="120px"
          height="calc(100vh - 68px)"
          justify="center"
          alignItems="center"
          gap="28px"
        >
          <k.div fontSize="3rem" fontWeight="900">
            VOICE CHAIN
          </k.div>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            NFTとAIであなたの声を資産に
          </k.div>
        </k.div>
        <k.div
          display="flex"
          flexDir="column"
          width="50%"
          pl="120px"
          height="calc(100vh - 68px)"
          justify="center"
          alignItems="center"
          gap="28px"
        >
          <Link
            href="/"
            style={{
              fontWeight: 900,
              padding: "12px 28px",
              border: "2px solid #000",
              transition: "opacity 220ms ease",
            }}
            className="hover:opacity-60"
          >
            Get Started
          </Link>
        </k.div>
      </k.div>

      <k.div width="100vw" display="flex">
        <k.div
          display="flex"
          flexDir="column"
          width="50%"
          pl="120px"
          height="100vh"
          justify="center"
          alignItems="center"
          gap="28px"
        >
          <k.div fontSize="3rem" fontWeight="900">
            VOICE CHAIN
          </k.div>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            NFTとAIであなたの声を資産に
          </k.div>
        </k.div>
        <k.div
          display="flex"
          flexDir="column"
          width="50%"
          pl="120px"
          height="100vh"
          justify="center"
          alignItems="center"
          gap="28px"
        >
          <Link
            href="/"
            style={{
              fontWeight: 900,
              padding: "12px 28px",
              border: "2px solid #000",
              transition: "opacity 220ms ease",
            }}
            className="hover:opacity-60"
          >
            Get Started
          </Link>
        </k.div>
      </k.div>
    </k.div>
  );
}
