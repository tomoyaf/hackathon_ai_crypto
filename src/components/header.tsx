import Link from "next/link";
import React from "react";
import { css } from "@kuma-ui/core";
import classNames from "classnames";

export type HeaderProps = {};

export const Header: React.FC<HeaderProps> = () => {
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
            className="flex text-sm h-[48px] w-full justify-center items-center flex-col gap-[2px] drop-shadow-xl font-bold"
          >
            おすすめ
          </Link>
          <div className="w-[calc(100%-36px)] h-[2px] bg-slate-50 absolute bottom-3 rounded-full" />
        </li>
        <li className="flex-1 flex h-[60px] justify-center items-center">
          <Link
            href="/"
            className="flex text-sm h-[48px] w-full justify-center items-center flex-col gap-[2px] drop-shadow-xl"
          >
            プレイリスト
          </Link>
        </li>
      </ol>
    </nav>
  );
};
