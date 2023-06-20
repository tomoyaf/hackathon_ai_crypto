import Document, {
  Html,
  Head,
  NextScript,
  Main,
  DocumentContext,
} from "next/document";
import React from "react";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja-JP">
        <Head>
          <link rel="icon" type="image/png" href="/logo.png" />
        </Head>
        <body>
          <noscript></noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
