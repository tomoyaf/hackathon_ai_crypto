import React from "react";
import { k } from "@kuma-ui/core";
import Link from "next/link";

export default function IndexPage() {
  return (
    <k.div width="100%">
      <k.nav display="flex" justify="center" alignItems="center" width="100%">
        <p>VOICE CHAIN</p>

        <k.ul flexGrow="1" display="flex" justify="end">
          <li>TOP</li>
          <li>AI + NFT</li>
          <li>VOICE</li>
          <li>MUSIC CREATORS</li>
          <li>MUSIC LOVERS</li>
        </k.ul>
      </k.nav>

      <k.div>
        <Link href="/">Get Started</Link>
        <k.div>E-mail: gazimum@gmail.com</k.div>
      </k.div>
    </k.div>
  );
}
