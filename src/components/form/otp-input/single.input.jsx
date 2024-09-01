/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useLayoutEffect, useRef } from "react";

import usePrevious from "@/hooks/usePrevious";

export function SingleOTPInputComponent(props) {
  const { focus, autoFocus, ...rest } = props;
  const inputRef = useRef(null);
  const prevFocus = usePrevious(!!focus);
  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus();
      }
      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [autoFocus, focus, prevFocus]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        {...rest}
        onInput={(e) => {
          e.target.value = e.target.value
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");
        }}
        className={`bg-white relative z-10 text-base text-black-1 text-center border-2 border-white-1 rounded-[10px] h-[45px] w-[45px] focus:outline-none`}
      />
      {focus && (
        <div className="absolute top-[3px] h-[45px] w-[45px] bg-primary rounded-[10px]"></div>
      )}
    </div>
  );
}

const SingleOTPInput = memo(SingleOTPInputComponent);
export default SingleOTPInput;
