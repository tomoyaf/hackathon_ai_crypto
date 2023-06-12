import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import React from "react";

export type BottomNavProps = {};

export const BottomNav: React.FC<BottomNavProps> = (props) => {
  return (
    <nav
      className={classNames("fixed", "bottom-0", "w-screen")}
      style={{
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.98) 100%)`,
      }}
    >
      <ol className="flex justify-around items-center">
        <li className="flex-1">
          <Link
            href="/"
            className="flex h-[54px] w-full justify-center items-center flex-col gap-[1px]"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-slate-200 text-[11px]">ホーム</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/"
            className="flex h-[54px] w-full justify-center items-center flex-col gap-[1px]"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span className="text-slate-200 text-[11px]">検索</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/"
            className="flex h-[54px] w-full justify-center items-center flex-col gap-[1px]"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span className="text-slate-200 text-[11px]">投稿</span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            href="/"
            className="flex h-[54px] w-full justify-center items-center flex-col gap-[1px]"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-slate-200 text-[11px]">マイページ</span>
          </Link>
        </li>
      </ol>
    </nav>
  );
};
