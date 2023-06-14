import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { css } from "@kuma-ui/core";
import classNames from "classnames";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const isVoiceModelTab = router.pathname === "/voices";

  return (
    <nav
      className={classNames(
        css({
          bg: "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.25) 60%, rgba(0, 0, 0, 0.0) 100%)",
        }),
        "fixed top-0 w-screen z-30"
      )}
    >
      <ol className="flex justify-around items-center w-[85%] m-auto">
        <li className="flex-1 flex h-[60px] justify-center items-center relative">
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
            className="w-[calc(100%-36px)] h-[2px] bg-slate-50 absolute bottom-3 rounded-full transition-transform"
            style={{
              transform: isVoiceModelTab
                ? "translateX(42.5vw)"
                : "translateX(0)",
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
      </ol>
    </nav>
  );
};
