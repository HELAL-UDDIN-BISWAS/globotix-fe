const SecondaryButton = (props) => {
  const attr = { ...props };
  delete attr["loading"];
  return (
    <>
      <button
        className={`w-max min-w-[100px] text-primary flex items-center justify-center py-4 px-5 h-[${
          props.height ? props.height : "45"
        }px]  rounded-[10px]  bg-primary02 border border-primary
         `}
        {...attr}
      >
        <div className="flex space-x-2 w-max justify-center items-center font-semibold text-primary">
          {props.children}
        </div>
      </button>
    </>
  );
};

export default SecondaryButton;
