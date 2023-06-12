import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import "../app/globals.css";

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
  );
}
export default App;
