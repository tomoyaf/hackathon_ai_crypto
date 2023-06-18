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
    <k.div
      width="100vw"
      display="flex"
      justify="center"
      alignItems="center"
      flexDir="column"
      gap="36px"
      p="24px 0"
    >
      <k.div
        width="90%"
        display="flex"
        justify="center"
        alignItems="center"
        p="80px 0"
      >
        {isLoading ? (
          <k.div>loading...</k.div>
        ) : (
          <k.div display="flex" flexWrap="wrap" width="100%" gap="24px">
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
