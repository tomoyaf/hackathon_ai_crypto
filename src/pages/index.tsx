import { k } from "@kuma-ui/core";
import { Header, BottomNav, Layout } from "@/components";

export default function IndexPage() {
  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar"
      height="100vh"
      style={{ overflowY: "scroll" }}
    ></k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;
