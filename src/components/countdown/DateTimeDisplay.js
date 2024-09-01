import React from "react";

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={"text-black-1"}>
      <p>{("0" + value).slice(-2)}</p>
      {/* <span>{type}</span> */}
    </div>
  );
};

export default DateTimeDisplay;
