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
import { css, k, styled } from "@kuma-ui/core";

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
    <k.div
      position="fixed"
      bottom="0px"
      width="100%"
      display="flex"
      flexDir="column"
    >
      <FloatingBar>
        <img
          src="https://i.scdn.co/image/ab67616d00001e02821db8ce6379c713a5a3a4b5"
          alt=""
          className={css({
            borderRadius: "4px",
            gridArea: "grid-area",
            height: "40px",
            width: "40px",
          })}
        />
        <div
          className={css({ display: "flex", flexDir: "column", gap: "4px" })}
        >
          <span className={css({ fontSize: "0.8rem", fontWeight: 700 })}>
            1999
          </span>
          <span className={css({ fontSize: "0.8rem" })}>Hitsujibungaku</span>
        </div>
        <div className={css({ ml: "auto", mr: "16px", display: "flex" })}>
          <k.button>
            <svg
              role="img"
              height="24px"
              width="24px"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-encore-id="icon"
              style={{ fill: "white" }}
            >
              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
            </svg>
          </k.button>
        </div>
      </FloatingBar>
      <nav
        className={css({
          bg: "linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.98) 100%)",
        })}
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
    </k.div>
  );
};

const FloatingBar = styled("div")`
  background: #523636;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  height: 56px;
  margin: 0 8px;
  padding: 8px;
  position: relative;
  -webkit-transition: background-color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;
  z-index: 1;
`;
