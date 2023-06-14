import {
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export type BottomNavProps = {};

export const BottomNav: React.FC<BottomNavProps> = () => {
  const router = useRouter();

  const links = [
    {
      label: "ホーム",
      url: "/",
      renderIcon: (props: { isSelected: boolean }) =>
        props.isSelected ? (
          <HomeIconSolid className="w-5 h-5" />
        ) : (
          <HomeIconOutline className="w-5 h-5" />
        ),
    },
    {
      label: "検索",
      url: "/search",
      renderIcon: (props: { isSelected: boolean }) =>
        props.isSelected ? (
          <MagnifyingGlassIconSolid className="w-5 h-5" />
        ) : (
          <MagnifyingGlassIconOutline className="w-5 h-5" />
        ),
    },
    {
      label: "投稿",
      url: "/post",
      renderIcon: (props: { isSelected: boolean }) =>
        props.isSelected ? (
          <PlusCircleIconSolid className="w-5 h-5" />
        ) : (
          <PlusCircleIconOutline className="w-5 h-5" />
        ),
    },
    {
      label: "マイページ",
      url: "/mypage",
      renderIcon: (props: { isSelected: boolean }) =>
        props.isSelected ? (
          <UserIconSolid className="w-5 h-5" />
        ) : (
          <UserIconOutline className="w-5 h-5" />
        ),
    },
  ];

  return (
    <nav
      className={classNames("fixed", "bottom-0", "w-screen")}
      style={{
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.98) 100%)`,
      }}
    >
      <ol className="flex justify-around items-center">
        {links.map((link) => (
          <li key={link.url} className="flex-1">
            <Link
              href={link.url}
              className="flex h-[54px] w-full justify-center items-center flex-col gap-[1px]"
            >
              {link.renderIcon({ isSelected: link.url === router.pathname })}
              <span
                className={classNames("text-slate-200 text-[11px]", {
                  "font-bold": link.url === router.pathname,
                })}
              >
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};
