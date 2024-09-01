
const BoxContainer = (props) => {
  const bg = props.bg ? props.bg : "bg-white";

  return (
    <div className={`w-full ${bg}`}>
      <div className="w-full max-w-[1440px] mx-auto">{props.children}</div>
    </div>
  );
};

export default BoxContainer;
