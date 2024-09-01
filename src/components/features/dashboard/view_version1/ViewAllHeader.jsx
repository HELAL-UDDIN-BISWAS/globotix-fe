import { IoEyeOutline } from "react-icons/io5";

const ViewAllHeader = ({
	title,
	count,
	padding,
	onViewAll,
	viewAll = false,
}) => {
	return (
		<div className={`flex justify-between p-${padding}`}>
			<span className="text-[#A18613] text-[14px] font-bold font-inter">
				{title} {count && <span className="text-[#667085]">{count}</span>}
			</span>
			{viewAll && (
				<div
					className="flex items-center space-x-2 cursor-pointer"
					onClick={onViewAll}>
					<span className="text-[#004FF0] text-[14px] font-bold font-inter">
						View All
					</span>
					<IoEyeOutline color="#004FF0" size={24} />
				</div>
			)}
		</div>
	);
};

export default ViewAllHeader;
