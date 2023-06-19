import { ReactNode } from "react";
import { AppLayoutProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../app/globals.css";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import { PlayerProvider } from "@/hooks/usePlayer";
import { Onboard } from "@/components/onboard";

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <PlayerProvider>
          <Toaster />
          {getLayout(<Component {...pageProps} />)}
          <Onboard />
        </PlayerProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}
export default App;
