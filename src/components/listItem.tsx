import React from "react";
import { k, styled, css } from "@kuma-ui/core";

export const ListItem = () => {
  return (
    <k.div
      role="row"
      maxWidth="1200px"
      mx="auto"
      _hover={{
        bgColor: "hsla(0,0%,100%,.1)",
        cursor: "pointer",
      }}
    >
      <Content>
        <div className={css({ display: "flex" })}>
          <button>
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
          </button>
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
            src="https://i.scdn.co/image/ab67616d00001e02f5c5c21c1bd67ae9fc86064c"
            alt=""
            width="40px"
            height="40px"
            mr="16px"
            flexShrink={0}
          />
          <k.div fontSize="1rem" fontWeight={400} color="white">
            残機
          </k.div>
        </k.div>
        <k.div
          fontSize="0.8rem"
          display="flex"
          alignItems="center"
          color="#b3b3b3"
        >
          <span>29,932,367</span>
        </k.div>
        <k.div
          display="flex"
          gridColumn="last"
          alignItems="center"
          style={{
            justifySelf: "end",
          }}
        >
          <svg
            role="img"
            height="16px"
            width="16px"
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-encore-id="icon"
            fill="white"
          >
            <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"></path>
          </svg>
        </k.div>
      </Content>
    </k.div>
  );
};

const Content = styled("div")`
  border: 1px solid transparent;
  border-radius: 4px;
  height: 56px;
  position: relative;
  padding: 0px 16px;
  grid-gap: 16px;
  display: grid;
  padding: 0 16px;
  grid-template-columns: [index] 16px [first] 4fr [var1] 2fr [last] minmax(
      120px,
      1fr
    );
`;
