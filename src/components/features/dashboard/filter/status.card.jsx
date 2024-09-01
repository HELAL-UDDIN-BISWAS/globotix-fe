import { useState } from "react";

const CardStatus = (props) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => props.setOnline()}
        className={`${
          props.online || hover
            ? "bg-primary text-white font-semibold"
            : "bg-btnColor text-primary"
        }  max-w-[124px] min-w-[124px] h-[46px] cursor-pointer rounded-[10px] p-4 flex justify-center items-center text-sm `}
      >
        {props.label} ({props.total})
      </div>
    </>
  );
};

export default CardStatus;
