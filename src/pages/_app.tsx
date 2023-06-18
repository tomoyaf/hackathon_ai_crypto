import { ReactNode } from "react";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../app/globals.css";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <Toaster />
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </RecoilRoot>
  );
}
export default App;
