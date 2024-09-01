import { useState } from "react";

import Button from "../common/button";

const DeleteModal = (props) => {
  const [selectedData, setSelectedData] = useState(null);

  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };

  const handleDelete = () => {
    if (props.loading) return;
    props.onDelete();
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
        } left-1/2 -translate-x-1/2 py-[50px] px-[50px] border rounded-[20px] w-[90%] md:w-max h-max bg-white text-black-1`}
      >
        <div className="font-bold text-xl text-blue-2 text-center">
          Please click on Confirm to delete!
        </div>
        <div className="flex justify-center items-center w-full space-x-5 mt-5">
          <Button onClick={() => handleClose()} loading={false} type="button">
            <span className="text-sm text-white">Cancel</span>
          </Button>
          <Button
            onClick={() => handleDelete()}
            loading={props.loading}
            type="button"
          >
            <span className="text-sm text-white">Confirm</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
