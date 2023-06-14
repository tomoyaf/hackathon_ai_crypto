import React from "react";
import { css, k, styled } from "@kuma-ui/core";

export const FloatingBar: React.FC<{}> = () => {
  return (
    <Floating>
      <img
        src="https://i.scdn.co/image/ab67616d00001e02821db8ce6379c713a5a3a4b5"
        alt=""
        className={css({
          borderRadius: "4px",
          gridArea: "grid-area",
          height: "40px",
          width: "40px",
        })}
      />
      <div className={css({ display: "flex", flexDir: "column", gap: "4px" })}>
        <span className={css({ fontSize: "0.8rem", fontWeight: 700 })}>
          1999
        </span>
        <span className={css({ fontSize: "0.8rem" })}>Hitsujibungaku</span>
      </div>
      <div className={css({ ml: "auto", mr: "16px", display: "flex" })}>
        <k.button>
          <svg
            role="img"
            height="24px"
            width="24px"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-encore-id="icon"
            style={{ fill: "white" }}
          >
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
          </svg>
        </k.button>
      </div>
    </Floating>
  );
};

const Floating = styled("div")`
  background: #523636;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  height: 56px;
  margin: 0 8px;
  padding: 8px;
  position: relative;
  -webkit-transition: background-color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;
  z-index: 1;
`;

// #f81c55
