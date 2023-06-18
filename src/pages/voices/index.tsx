import { k, styled } from "@kuma-ui/core";
import { Layout, SongItem } from "@/components";
import React from "react";
import useSWR from "swr";
import { VoiceModel } from "@prisma/client";
import Link from "next/link";
import { Card } from "@/components/card";

export default function VoiceIndexPage() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // TODO: throttle入れる
  const { data, isLoading } = useSWR<VoiceModel[]>(`/api/voiceModels`, fetcher);

  return (
    <k.div>
      <k.div mt="100px"></k.div>

      <k.div
        display="flex"
        flexDir="column"
        alignItems="center"
        bg="linear-gradient(136deg, #0f1724, #05111c)"
        p="36px 0"
      >
        {isLoading ? (
          <k.div>loading...</k.div>
        ) : (
          <k.div
            display="flex"
            flexWrap="wrap"
            width="800px"
            maxWidth="100%"
            gap="24px"
          >
            {data?.map((voiceModel) => (
              <Card
                key={voiceModel.id}
                href={`/voices/${voiceModel.id}`}
                imageUrl={voiceModel.thumbnailUrl}
                title={voiceModel.title}
                description={voiceModel.description}
              />
            ))}
          </k.div>
        )}
      </k.div>
    </k.div>
  );
}

VoiceIndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
