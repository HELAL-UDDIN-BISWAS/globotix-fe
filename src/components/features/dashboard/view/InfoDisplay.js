import React from "react";

const InfoDisplay = (props) => {
  const displayValue = Array.isArray(props?.value)
    ? props.value.join(", ")
    : props?.value || "-";

  return (
    <div className="flex items-center gap-2">
      <span className="text-left min-w-[150px] max-w-[150px] w-[150px] text-sm text-secondaryFontColor font-medium">
        {props?.caption}
      </span>
      <span className="text-sm text-secondaryFontColor font-medium">:</span>

      <span className="text-bodyTextColor text-left text-sm font-medium">
        {displayValue}
      </span>
    </div>
  );
};

export default InfoDisplay;
