import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../app/globals.css";

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <SessionProvider session={session}>
      <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
    </SessionProvider>
  );
}
export default App;
