import { useState } from "react";
import ManageCleaningPlanForm from "./manageCleaningPlan.form";

const CleaningPlanView = (props) => {
  const [openEditOrganization, setOpenEditOrganization] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleClose = () => {
    props.onClose();
    setTimeout(() => {
      setOpenEditOrganization(false);
    }, 300);
  };

  return (
    <>
      {props.open && (
        <div
          onClick={() => handleClose()}
          className="bg-black fixed w-full h-screen top-0 left-0 z-[997] opacity-40"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[998] top-0 ${
          props.open ? "right-0" : "-right-[450px]"
        } py-[50px] px-[50px] border rounded-l-[20px] w-[450px] h-screen bg-white text-black-1`}
      >
        <ManageCleaningPlanForm
          onEdit={(data) => {
            setOpenEditOrganization(true);
            setSelectedData(data);
          }}
          onClose={() => props.onClose()}
        />
      </div>
    </>
  );
};

export default CleaningPlanView;
