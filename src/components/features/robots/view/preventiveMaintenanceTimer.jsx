import Button from "@/components/common/button";

const PreventiveMaintenanceTimer = (props) => {
  return (
    <>
      {props.open && (
        <div
          onClick={() => props.onClose()}
          className="bg-black fixed w-full h-screen top-0 left-0 z-[997] opacity-40"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[998] top-0 ${
          props.open ? "right-0" : "-right-[450px]"
        } py-[50px] px-[50px] border rounded-l-[20px] w-[450px] h-screen bg-white text-black-1`}
      >
        <>
          <div className="font-bold text-2xl text-primary">
            Preventive Maintenance Timer
          </div>

          <div className="mt-[30px] space-y-2.5 overflow-y-auto text-sm text-black 1">
            The preventive maintenance timer is the timer when the robot
            commences official usage on-site; the number of hours clocked until
            it reaches the preventive maintenance target.
          </div>

          <div className="mt-[30px]">
            <Button
              type="button"
              formNoValidate="formnovalidate"
              onClick={() => props.onClose()}
            >
              <span className="text-sm text-white">Got it!</span>
            </Button>
          </div>
        </>
      </div>
    </>
  );
};

export default PreventiveMaintenanceTimer;
