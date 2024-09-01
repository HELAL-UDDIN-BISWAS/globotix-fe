import { useState } from "react";

import Button from "../common/button";
import Image from "next/image";
import successIcon from "/public/upload/icons/icon_success.svg";
const SuccessModal = (props) => {
  const [selectedData, setSelectedData] = useState(null);

  const handleClick = () => {
    if (props.loading) return;
    props.onBack();
  };

  return (
    <>
      {props.open && (
        <div
          onClick={() => handleClose()}
          className="bg-black fixed w-full h-screen top-0 left-0 z-[997] opacity-40 transition-all"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[998] ${
          props.open ? "bottom-1/2 translate-y-1/2" : "-bottom-[450px]"
        } left-1/2 -translate-x-1/2 py-[30px] px-[60px] rounded-[20px] w-[90%] md:w-max h-max bg-white text-black-1`}
      >
        <div className=" flex flex-col gap-2 items-center justify-center text-center">
          <Image src={successIcon} alt="" width={50} height={50} />
          <span className="font-bold text-base text-titleFontColor">
            {props?.successText}
          </span>
        </div>
        <div className="flex justify-center items-center w-full space-x-5 mt-5">
          <Button
            onClick={() => handleClick()}
            loading={props.loading}
            type="button"
          >
            <span className="text-base font-bold text-white">
              {props?.text}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;
