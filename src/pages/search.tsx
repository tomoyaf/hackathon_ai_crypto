import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { VoiceModel } from "@prisma/client";
import Link from "next/link";

export default function SearchPage() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [query, setQuery] = React.useState("");
  // TODO: throttle入れる
  const { data, isLoading } = useSWR<VoiceModel[]>(
    `/api/voiceModels?q=${query}`,
    fetcher
  );

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
      <k.div width="600px" maxWidth="90%">
        <k.div width="100%" display="flex" gap="18px">
          <MagnifyingGlassIcon width="28px" />
          <k.input
            type="search"
            flexGrow="1"
            borderRadius="4px"
            p="6px 14px"
            color="#2e3855"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </k.div>
      </k.div>

      <k.div width="90%" display="flex" justify="center" alignItems="center">
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
                  bg="linear-gradient(175deg, rgb(8 37 52) 0%, rgb(3 14 36) 100%)"
                  overflow="hidden"
                  _hover={{ opacity: 0.7 }}
                >
                  <k.img src={voiceModel.thumbnailUrl} width="200" />
                  <k.div m="6px 0 0" p="4px 12px 0">
                    {voiceModel.title}
                  </k.div>
                  <k.div fontSize="0.85rem" color="#bbb" p="0 12px 8px">
                    {voiceModel.description}
                  </k.div>
                </k.div>
              </Link>
            ))}
          </k.div>
        )}
      </k.div>
    </k.div>
  );
}

SearchPage.getLayout = (page: any) => <Layout>{page}</Layout>;
