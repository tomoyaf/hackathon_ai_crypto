import { Layout, SongItem } from "@/components";
import { k } from "@kuma-ui/core";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";
import { useRouter } from "next/router";
import { VoiceModel } from "@prisma/client";

type ServerProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function IndexPage({ initialData }: ServerProps) {
  const items = useFeedItems();
  const router = useRouter();
  const { id } = router.query;
  const { data = initialData, isLoading } = useSWR<VoiceModel>(
    `/api/voiceModels/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  return (
    <k.div
      className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll"
      height="100vh"
    ></k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;

export async function getServerSideProps({ params }: any) {
  const res = await fetch(`http://localhost:3009/api/voiceModels/${params.id}`);
  const initialData: VoiceModel = await res.json();

  return {
    props: { initialData },
  };
}
