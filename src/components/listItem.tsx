import React from "react";
import { k, styled, css } from "@kuma-ui/core";
import { Music, VoiceModel } from "@prisma/client";
import { usePlayer } from "@/hooks/usePlayer";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export type ListItemProps = {
  music: Music & { isLiked: boolean; voiceModel: VoiceModel };
  updateEvaluation: (evaluation: number) => void;
};

export const ListItem: React.FC<ListItemProps> = ({
  music,
  updateEvaluation,
}) => {
  const { handlePlayButtonClick, currentMusic, isMusicPlaying } = usePlayer();

  const nowPlaying = currentMusic?.id === music.id && !!isMusicPlaying(music);
  const [isLiked, setIsLiked] = React.useState(music.isLiked);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    updateEvaluation(isLiked ? 0 : 1);

    setIsLiked(!isLiked);
  };

  return (
    <k.button
      role="row"
      onClick={() => handlePlayButtonClick(music)}
      maxWidth="1200px"
      mx="auto"
      width={["100%", "500px", "800px"]}
      borderRadius="4px"
      _hover={{
        bgColor: "hsla(0,0%,100%,.1)",
        cursor: "pointer",
      }}
    >
      <Content>
        <div className={css({ display: "flex" })}>
          <k.div display="flex" justify="center" alignItems="center">
            {!nowPlaying ? (
              <svg
                role="img"
                height="16px"
                width="16px"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-encore-id="icon"
                fill="white"
              >
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
              </svg>
            ) : (
              <svg
                role="img"
                height="16px"
                width="16px"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-encore-id="icon"
                fill="#f81c55"
              >
                <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            )}
          </k.div>
        </div>

        <k.div
          display="flex"
          flexDir="row"
          alignItems="center"
          style={{ justifySelf: "start" }}
        >
          <k.img
            aria-hidden="false"
            draggable="false"
            loading="eager"
            src={music.thumbnailUrl}
            borderRadius="4px"
            alt=""
            width="40px"
            height="40px"
            mr="16px"
            flexShrink={0}
          />

          <k.div
            fontSize="0.85rem"
            fontWeight={400}
            color="white"
            _hover={{
              textDecoration: "underline",
            }}
            style={{
              color: nowPlaying ? "#f81c55" : "white",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/musics/${music.id}`}>{music.title}</Link>
          </k.div>
        </k.div>

        <k.div
          overflow="hidden"
          fontSize="0.85rem"
          opacity={0.7}
          _hover={{
            textDecoration: "underline",
          }}
          style={{
            whiteSpace: "nowrap",
            color: nowPlaying ? "#f81c55" : "white",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/voices/${music.voiceModel.id}`}>
            {music.voiceModel.title}
          </Link>
        </k.div>

        <k.button
          display="flex"
          gridColumn="last"
          alignItems="center"
          justify="center"
          style={{
            justifySelf: "end",
          }}
          borderRadius="9999px"
          width="38px"
          height="38px"
          transition="background ease 220ms"
          _hover={{
            bg: "#34364a",
          }}
          onClick={handleLike}
        >
          {isLiked ? (
            <HeartSolidIcon
              width="22px"
              style={{ color: nowPlaying ? "#f81c55" : "#b3b3b3" }}
            />
          ) : (
            <HeartOutlineIcon
              width="22px"
              style={{ color: nowPlaying ? "#f81c55" : "#b3b3b3" }}
            />
          )}
        </k.button>
      </Content>
    </k.button>
  );
};

const Content = styled("div")`
  border: 1px solid transparent;
  border-radius: 4px;
  height: 56px;
  position: relative;
  padding: 0px 16px;
  display: grid;
  align-items: center;
  padding: 0 16px;
  grid-template-columns: [index] 36px [first] 6fr [second] 4fr [last] minmax(
      30px,
      1fr
    );
  width: 100%;
`;
