import React, { FC } from "react";

const Del: FC = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"del-ed"}
    >
      <path
        d="M0.679016 15.8722L16 0.553101"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.679016 0.553101L16 15.8722"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Del;