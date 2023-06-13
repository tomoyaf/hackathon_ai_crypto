import { ReactNode } from "react";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import "../app/globals.css";

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return getLayout(<Component {...pageProps} />);
}
export default App;
