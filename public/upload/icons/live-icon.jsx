import React from "react";

function LiveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="70"
      height="70"
      fill="none"
      viewBox="0 0 70 70"
    >
      <path fill="url(#pattern0_2697_79229)" d="M0 0H70V70H0z"></path>
      <defs>
        <pattern
          id="pattern0_2697_79229"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00195)" xlinkHref="#image0_2697_79229"></use>
        </pattern>
        <image
          id="image0_2697_79229"
          width="512"
          height="512"
          xlinkHref="data:image/png;base64,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"
        ></image>
      </defs>
    </svg>
  );
}

export default LiveIcon;