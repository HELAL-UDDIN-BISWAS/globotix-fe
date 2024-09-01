const ButtonOptionTab = ({ active, text, onClick }) => {
  return (
    <button
      onClick={() => onClick()}
      className={`
      ${active ? "text-white bg-blue-3" : "text-primary bg-white-1"}
      
      hover:text-white hover:bg-blue-3 text-xs font-semibold rounded-full py-2 px-5`}
    >
      {text}
    </button>
  );
};

export default ButtonOptionTab;
