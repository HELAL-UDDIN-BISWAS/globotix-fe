import React from "react";
import { BiReset } from "react-icons/bi";

const ResetButton = ({ onClick }) => {
  return (
    <div className="flex items-center gap-1 cursor-pointer" onClick={onClick}>
      <span className="text-hyperLinkColor border border-t-0 border-l-0 border-r-0 border-b-hyperLinkColor">
        Reset
      </span>
      <BiReset fill="#599CFF" />
    </div>
  );
};

export default ResetButton;
