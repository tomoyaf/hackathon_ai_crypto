import React from "react";
import { k } from "@kuma-ui/core";

export default function IndexPage() {
  return (
    <k.div width="100%">
      <k.nav display="flex" justify="center" alignItems="center" width="100%">
        <p>VOICE CHAIN</p>

        <k.ul flexGrow="1" display="flex" justify="end">
          <li>TOP</li>
          <li>AI + NFT</li>
          <li>FOR MUSIC CREATORS</li>
          <li>FOR MUSIC CREATORS</li>
          <li>FOR MUSIC LOVERS</li>
        </k.ul>
      </k.nav>
    </k.div>
  );
}
