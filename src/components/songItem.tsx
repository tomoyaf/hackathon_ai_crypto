import React, { FC } from "react";
import { k, styled, css } from "@kuma-ui/core";
import { VoiceModel } from "@prisma/client";
import Link from "next/link";
import { usePlayer } from "@/hooks/usePlayer";

export const SongItem: FC<{
  voiceModel: VoiceModel;
}> = ({ voiceModel }) => {
  // const {isMusicPlaying, currentMusic} = usePlayer()

  // const isPlaying = currentMusic?.id ===

  return (
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
        <k.div
          fontSize="0.85rem"
          color="#bbb"
          p="0 12px 8px"
          overflow="hidden"
          // className="text-ellipsis whitespace-nowrap"
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {voiceModel.description}
        </k.div>
      </k.div>
    </Link>
  );
};
