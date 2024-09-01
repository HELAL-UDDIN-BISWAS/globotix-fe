import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const ButtonExpandable = (props) => {
  const [expand, setExpand] = useState(false);
  const [contentWidth, setContentWidth] = useState("auto");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(`${containerRef.current.offsetWidth}px`);
    }
  }, [expand]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setExpand(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="rounded-[10px] bg-white min-w-[250px]">
      {/* FILTER DURATION */}
      <div
        onClick={() => setExpand(!expand)}
        className={`cursor-pointer flex justify-between items-center gap-[10px] p-4 
        ${expand ? "bg-primary02" : "bg-primary"}
      } rounded-t-[10px]  ${!expand ? "rounded-b-[10px]" : "border-b-0"}`}
      >
        <label
          className={`${
            expand ? "text-primary" : "text-white"
          } text-base font-semibold cursor-pointer`}
        >
          {props.title}
        </label>
        {expand ? (
          <MdKeyboardArrowUp size={20} color="black" />
        ) : (
          <MdKeyboardArrowDown size={20} color="white" />
        )}
      </div>
      {expand && (
        <div
          className="absolute rounded-b-[10px] p-4 bg-white z-50"
          style={{ width: contentWidth }}
        >
          <div className="text-right py-1">
            <span
              className=" font-semibold text-red cursor-pointer"
              onClick={props.onClear}
            >
              Clear
            </span>
          </div>
          {props?.children}
        </div>
      )}
    </div>
  );
};

export default ButtonExpandable;
