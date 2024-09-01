const StatusCard = ({ icon, title, value, color }) => {
	return (
		<div
			className="flex flex-col gap-2 rounded-[5px] bg-white px-3 py-2"
			style={{ boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)" }}>
			<div className="flex space-x-2">
				{icon}
				<h3 className="text-primary text-[24px] font-bold font-inter">
					{title}
				</h3>
			</div>
			<h3 className={`text-${color} text-[40px] font-bold font-inter`}>
				{value}
			</h3>
		</div>
	);
};

export default StatusCard;
