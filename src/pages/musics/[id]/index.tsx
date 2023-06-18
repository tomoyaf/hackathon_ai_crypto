import { Layout, SongListItem } from "@/components";
import { k, styled, css } from "@kuma-ui/core";
import React from "react";
import { InferGetServerSidePropsType } from "next";
import useSWR from "swr";
import { useRouter } from "next/router";
import { VoiceModel, Music } from "@prisma/client";

type VoiceModelWithMusics = VoiceModel & {
  musics: Music[];
};
type ServerProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function IndexPage({ initialData }: ServerProps) {
  const router = useRouter();
  const { id } = router.query;
  const { data = initialData } = useSWR<VoiceModelWithMusics>(
    `/api/musics/${id}`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  return (
    <k.div className="snap-y snap-mandatory hidden-scrollbar overflow-y-scroll flex-wrap">
      <Upper>
        <UpperContent className={css({ bgColor: "#32304d" })} />
        <UpperContent
          className={css({
            bg: "linear-gradient(transparent 0,rgba(0,0,0,.5) 100%),url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)",
          })}
        />

        <k.div
          display="flex"
          flexShrink={0}
          width="100%"
          zIndex="1"
          flexDir="row"
          maxWidth="1200px"
          flexWrap="wrap"
          m="0 auto"
          gap="24px"
          style={{
            alignSelf: "flex-end",
          }}
        >
          <k.div>
            <k.img
              height="192px"
              width="192px"
              boxShadow="0 4px 60px rgba(0,0,0,.5)"
              borderRadius="50%"
              src={data.thumbnailUrl}
              alt={data.title}
            />
          </k.div>
          <k.div
            display="flex"
            justify="center"
            flexDir="column"
            zIndex="1"
            width="800px"
          >
            <k.h1 fontSize="3rem" color="white" fontWeight={900}>
              {data.title}
            </k.h1>
            <k.div color="#9f9f9f">{data.description}</k.div>
          </k.div>
        </k.div>
      </Upper>
      <k.div mt="50px"></k.div>

      {/* {data.musics.map((m, i) => {
        return <SongListItem music={m} key={m.id} />;
      })} */}
    </k.div>
  );
}

IndexPage.getLayout = (page: any) => <Layout>{page}</Layout>;

const Upper = styled("div")`
  height: 30vh;
  max-height: 400px;
  min-height: 340px;
  color: #fff;
  display: flex;
  max-width: none;
  overflow: hidden;
  position: relative;
  padding: 0px 24px 24px;
`;

const UpperContent = styled("div")`
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

export async function getServerSideProps({ params }: any) {
  const res = await fetch(`http://localhost:3009/api/voiceModels/${params.id}`);
  const initialData: VoiceModelWithMusics = await res.json();

  return {
    props: { initialData },
  };
}
