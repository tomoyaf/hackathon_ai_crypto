import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { VoiceModel } from "@prisma/client";
import { Card } from "@/components/card";

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
      p="24px 0 120px"
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

SearchPage.getLayout = (page: any) => <Layout>{page}</Layout>;
