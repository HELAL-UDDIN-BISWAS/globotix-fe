const ListItem = ({ botName, description, time, date, bgColor }) => {
	return (
    <div className={`grid grid-cols-5 h-[40px] place-items-center ${bgColor}`}>
    <span className="text-[#667085] text-[14px] font-bold font-inter">{botName}</span>
    <span className="col-span-3 text-bodyTextColor text-[14px] font-normal font-inter">{description}</span>
    <span>
      <span className="text-[#667085] text-[12px] font-normal block">{time}</span>
      <span className="text-[#667085] text-[12px] font-normal block">{date}</span>
    </span>
  </div>
	);
};

export default ListItem;
