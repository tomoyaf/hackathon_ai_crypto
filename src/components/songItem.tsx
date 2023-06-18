import React, { FC } from "react";
import { k, styled, css } from "@kuma-ui/core";
import { VoiceModel } from "@prisma/client";

export const SongItem: FC<{
  voiceModel: VoiceModel;
}> = ({ voiceModel }) => {
  return (
    <k.div
      _hover={{
        bgColor: "hsla(0,0%,100%,.1)",
        cursor: "pointer",
      }}
    >
      <Content>
        <k.div height="100%">
          <k.div mb="16px" position="relative">
            <k.div pb="100%">
              <k.img
                src={voiceModel.thumbnailUrl}
                width="100%"
                height="100%"
                position="absolute"
                top="0"
                left="0"
              />
            </k.div>
          </k.div>
          <k.div minHeight="62px">
            <k.p fontSize="1rem" fontWeight={700} pb={4}>
              {voiceModel.title}
            </k.p>
          </k.div>
        </k.div>
      </Content>
    </k.div>
  );
};

const Content = styled("div")`
  --card-container-border-radius: clamp(
    4px,
    ((189px, 0px) - 32px) * 0.025,
    8px
  );
  -webkit-box-flex: 1;
  background: #181818;
  border-radius: calc(var(--card-container-border-radius) + 2px);
  -ms-flex: 1;
  flex: 1;
  isolation: isolate;
  padding: 16px;
  position: relative;
  -webkit-transition: background-color 0.3s ease;
  transition: background-color 0.3s ease;
  width: 100%;
`;
