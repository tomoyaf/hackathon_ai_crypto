import { Box } from "@chakra-ui/react";
import { Header, BottomNav, Layout } from "@/components";

export default function IndexPage() {
  return (
    <Box
      className="snap-y snap-mandatory hidden-scrollbar"
      h="100vh"
      overflowY="scroll"
    ></Box>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
