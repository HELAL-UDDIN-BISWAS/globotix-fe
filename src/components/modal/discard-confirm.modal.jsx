import { useState } from "react";

import Button from "../common/button";
import SecondaryButton from "../button/SecondaryButton";

const DiscardModal = (props) => {
  const [selectedData, setSelectedData] = useState(null);

  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };

  const handleLeave = () => {
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
        } left-1/2 -translate-x-1/2 py-[30px] px-[50px] rounded-[20px] w-[90%] md:w-max h-max bg-white text-black-1`}
      >
        <div className="font-semibold mb-3 text-lg text-titleFontColor text-center">
          Confirmation Needed
        </div>
        <div className="text-base text-[#2F4858] w-[400px] text-center">
          Leaving this page without saving will undo your changes. Are you sure
          you want to discard your changes and leave the page?
        </div>
        <div className="flex justify-center items-center w-full space-x-5 mt-5">
          <SecondaryButton
            onClick={() => handleClose()}
            loading={false}
            type="button"
          >
            <span className="text-sm text-primary">Cancel</span>
          </SecondaryButton>
          <Button
            onClick={() => handleLeave()}
            loading={props.loading}
            type="button"
          >
            <span className="text-sm text-white">Leave</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default DiscardModal;
