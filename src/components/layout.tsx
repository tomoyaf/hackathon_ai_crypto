import { Box } from "@chakra-ui/react";
import { Header, BottomNav } from "@/components";
import React from "react";

export const Layout: React.FC<{
  children: React.ReactNode;
  withHeader?: boolean;
}> = ({ children, withHeader }) => {
  return (
    <Box
      bg="rgb(2 6 23 / 1)"
      h="100vh"
      color="rgb(241 245 249 / 1)"
      pos="relative"
      overflowY="scroll"
    >
      {withHeader && <Header />}
      <Box as="main" h="100vh">
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
};
