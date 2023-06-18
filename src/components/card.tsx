import { k, styled } from "@kuma-ui/core";
import Link from "next/link";
import React from "react";

export type CardProps = {
  href: string;
  imageUrl: string;
  title: string;
  description: string;
};

export const Card: React.FC<CardProps> = ({
  href,
  imageUrl,
  title,
  description,
}) => {
  return (
    <StyledLink href={href}>
      <k.div
        width={["100%", "250px"]}
        height="300px"
        overflow="hidden"
        borderRadius={["0", "4px"]}
        display="flex"
        flexDir="column"
        transition="opacity ease 220ms"
        _hover={{ opacity: 0.7 }}
        bg="linear-gradient(175deg, rgb(51 85 102) 0%, rgb(3 14 36) 100%)"
      >
        <k.img
          src={imageUrl}
          width={["100%", "250px"]}
          height="180px"
          style={{ objectFit: "cover" }}
        />
        <k.div m="12px 0 4px" p="0 12px">
          {title}
        </k.div>
        <k.div color="#bbb" p="0 12px" fontSize="0.85rem">
          {description}
        </k.div>
      </k.div>
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  width: 250px;

  @media screen and (max-width: 576px) {
    width: 100%;
  }
`;
