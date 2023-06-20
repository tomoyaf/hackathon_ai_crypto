import React from "react";
import { k } from "@kuma-ui/core";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

export default function IndexPage() {
  return (
    <k.div width="100%">
      <k.nav
        display="flex"
        justify="center"
        alignItems="center"
        width="100%"
        height="86px"
        px="42px"
        position="fixed"
        top="0"
      >
        <Link href="/">
          <k.p fontSize="1.2rem" fontWeight="900">
            VOICE CHAIN
          </k.p>
        </Link>

        <k.ul
          flexGrow="1"
          display="flex"
          justify="end"
          alignItems="center"
          height="86px"
          fontWeight="900"
          gap="26px"
        >
          <k.li cursor="pointer">
            <ScrollLink to="top" smooth={true} offset={0} duration={300}>
              TOP
            </ScrollLink>
          </k.li>
          <k.li cursor="pointer">
            <ScrollLink to="ainft" smooth={true} offset={0} duration={300}>
              AI + NFT
            </ScrollLink>
          </k.li>
          <k.li cursor="pointer">
            <ScrollLink to="voice" smooth={true} offset={0} duration={300}>
              VOICE
            </ScrollLink>
          </k.li>
          <k.li cursor="pointer">
            <ScrollLink to="music" smooth={true} offset={0} duration={300}>
              MUSIC CREATORS
            </ScrollLink>
          </k.li>
          <k.li cursor="pointer">
            <ScrollLink to="lover" smooth={true} offset={0} duration={300}>
              MUSIC LOVERS
            </ScrollLink>
          </k.li>
          <k.li cursor="pointer">
            <ScrollLink to="contact" smooth={true} offset={0} duration={300}>
              CONTACT US
            </ScrollLink>
          </k.li>
        </k.ul>
      </k.nav>

      <k.div
        position="fixed"
        top="-22px"
        left="-22px"
        right="-22px"
        bottom="-22px"
        borderWidth="28px"
        borderColor="#000"
        borderRadius="52px"
        style={{ pointerEvents: "none" }}
      />

      <k.div
        id="top"
        width="100vw"
        pt="86px"
        display="flex"
        bg="linear-gradient(175deg, #ff9dbb 0%, #fc6992 100%)"
      >
        <k.div
          display="flex"
          flexDir="column"
          width="50%"
          pl="120px"
          height="calc(100vh - 86px)"
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
          height="calc(100vh - 86px)"
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

      <k.div width="100vw" display="flex" id="ainft">
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
            AI + NFT = ∞
          </k.div>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            NFTとAIの無限の可能性を体験しましょう
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

      <k.div
        width="100vw"
        display="flex"
        id="voice"
        bg="linear-gradient(175deg, #59e3c3 0%, #34c5a2 100%)"
      >
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
          <Link href="/">
            <k.div fontSize="3rem" fontWeight="900">
              POWER OF VOICE
            </k.div>
          </Link>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            あなたの声の力を解き放つ
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

      <k.div width="100vw" display="flex" id="music">
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
            FOR MUSIC CREATORS
          </k.div>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            自由に声を使える世界へ
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

      <k.div
        width="100vw"
        display="flex"
        id="lover"
        bg="linear-gradient(175deg, #6893ff 0%, #3368e6 100%)"
      >
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
            FOR MUSIC LOVERS
          </k.div>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            未来の音楽体験がここに
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
      <k.div width="100vw" display="flex" id="contact">
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
            CONTACT US
          </k.div>
          <k.div fontSize="1.5rem" fontWeight="900" pb="10vh">
            連絡先
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
          fontWeight="900"
        >
          Twitter: @to_m0ya
          <br />
          <br />
          E-mail: gazimum@gmail.com
        </k.div>
      </k.div>
    </k.div>
  );
}
