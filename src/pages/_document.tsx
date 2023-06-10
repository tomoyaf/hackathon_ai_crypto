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
        <Head></Head>
        <body>
          <noscript></noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
