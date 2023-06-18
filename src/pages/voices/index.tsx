import { k, styled } from "@kuma-ui/core";
import { Layout, SongItem } from "@/components";
import React from "react";
import useSWR from "swr";
import { VoiceModel } from "@prisma/client";
import Link from "next/link";

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
              <Link href={`/voices/${voiceModel.id}`}>
                <k.div
                  width="200px"
                  display="flex"
                  flexDir="column"
                  transition="opacity ease 220ms"
                  borderRadius="8px"
                  p="16px"
                  // bg="linear-gradient(175deg, rgb(8 37 52) 0%, rgb(3 14 36) 100%)"
                  bg="#25232d"
                  overflow="hidden"
                  _hover={{ opacity: 0.7 }}
                >
                  <k.div mb="16px" position="relative">
                    <k.div pb="100%">
                      <k.img
                        src={voiceModel.thumbnailUrl}
                        width="100%"
                        height="100%"
                        position="absolute"
                        top="0"
                        left="0"
                        borderRadius="4px"
                      />
                    </k.div>
                  </k.div>

                  <k.div m="0 0" p="0px 12px 0">
                    {voiceModel.title}
                  </k.div>
                  <k.div fontSize="0.85rem" color="#bbb" p="0 12px 8px">
                    {voiceModel.description}
                  </k.div>
                </k.div>
                {/* <SongItem voiceModel={voiceModel} key={voiceModel.id} /> */}
              </Link>
            ))}
          </k.div>
        )}
      </k.div>
    </k.div>
  );
}

VoiceIndexPage.getLayout = (page: any) => <Layout withHeader>{page}</Layout>;
