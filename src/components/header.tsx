import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { css, k } from "@kuma-ui/core";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const isVoiceModelTab = router.pathname === "/voices";

  return (
    <k.nav
      width="100vw"
      display="flex"
      justify="center"
      position="fixed"
      top="8px"
      zIndex="30"
      bg="linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <k.ol
        display="flex"
        justify="space-around"
        alignItems="center"
        m="auto"
        width="600px"
        maxWidth="100vw"
      >
        <li className="flex-1 flex h-[68px] justify-center items-center relative">
          <Link
            href="/"
            className={classNames(
              "flex text-sm h-[48px] w-full justify-center items-center flex-col gap-[2px] drop-shadow-xl",
              { "font-bold": !isVoiceModelTab }
            )}
          >
            サンプル曲
          </Link>
          <div
            className="w-full h-[2px] bg-slate-50 absolute bottom-3 rounded-full transition-transform"
            style={{
              transform: isVoiceModelTab ? "translateX(100%)" : "translateX(0)",
            }}
          />
        </li>
        <li className="flex-1 flex h-[60px] justify-center items-center">
          <Link
            href="/voices"
            className={classNames(
              "flex text-sm h-[48px] w-full justify-center items-center flex-col gap-[2px] drop-shadow-xl",
              { "font-bold": isVoiceModelTab }
            )}
          >
            声モデル
          </Link>
        </li>
      </k.ol>
    </k.nav>
  );
};
