import { Box } from "@chakra-ui/react";
import { Header } from "@/components";

export default function IndexPage() {
  return (
    <Box
      bg="rgb(2 6 23 / 1)"
      h="100vh"
      color="rgb(241 245 249 / 1)"
      pos="relative"
      overflowY="scroll"
    >
      <Header />
    </Box>
  );
}
