import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { k } from "@kuma-ui/core";
import classNames from "classnames";
import React from "react";

export type OnboardProps = {};

export const Onboard: React.FC<OnboardProps> = (props) => {
  const localStorageKey = "VOICE_CHAIN_ONBOARD";
  const [isClosed, setIsClosed] = React.useState(false);

  React.useEffect(() => {
    setIsClosed(!!window.localStorage.getItem(localStorageKey));
  }, []);

  const close = () => {
    window.localStorage.setItem(localStorageKey, "true");
    setIsClosed(true);
  };

  return isClosed ? null : (
    <k.div
      position="fixed"
      bottom="0"
      left="0"
      display="flex"
      justify="center"
      alignItems="center"
      width="100vw"
      p="100px"
      height="100px"
      bg="#000000e0"
      color="white"
    >
      <k.a
        href="https://tomoyaf.notion.site/f3293a74f8c04258b77e31aebbb6b5cc?pvs=4"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="0.85rem"
        display="flex"
        gap="4px"
        color="#35d0ac"
      >
        利用規約
      </k.a>
      と
      <k.a
        href="https://tomoyaf.notion.site/b1a2a24573414bb19693b33c2806e3c7?pvs=4"
        target="_blank"
        rel="noopener noreferrer"
        fontSize="0.85rem"
        display="flex"
        gap="4px"
        color="#35d0ac"
      >
        プライバシーポリシー
      </k.a>
      に同意していただけた場合のみ、本サービスをご利用していただくことができます。
      <k.div
        position="absolute"
        right="24px"
        top="24px"
        borderRadius="9999px"
        p="12px"
        cursor="pointer"
        transition="background ease 220ms"
        _hover={{ bg: "#333" }}
        onClick={close}
      >
        <XMarkIcon width="22px" />
      </k.div>
    </k.div>
  );
};
