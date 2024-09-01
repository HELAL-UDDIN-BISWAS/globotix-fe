const ButtonOptionChoose = ({ isStatic, active, text, onClick }) => {
  return (
    <button
      type="button"
      onClick={isStatic ? () => {} : () => onClick()}
      className={`
      whitespace-nowrap
      ${active ? "text-white bg-primary" : "text-primary bg-white-1"}
      
      ${
        isStatic
          ? "cursor-default"
          : "cursor-pointer hover:text-white hover:bg-primary "
      } text-xs font-semibold rounded-full py-2 px-4`}
    >
      {text}
    </button>
  );
};

export default ButtonOptionChoose;
