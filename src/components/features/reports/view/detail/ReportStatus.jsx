import React from "react";

const ReportStatus = () => {
	return (
		<div className="rounded-[10px] px-4 py-4 border border-[#9EA1A5] flex-1 min-h-0 bg-white">
			<label className="text-[#7E6E3C] text-[16px] font-semibold">
				Report Status
			</label>
			<div className="flex items-center gap-4 mt-[15px]">
				<div className="flex space-x-2 items-center">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<rect width="16" height="16" rx="4" fill="#0A8217" />
					</svg>
					<span className="text-[#344054] text-[14px] font-medium">
						Cleaned Area
					</span>
				</div>
				<div className="flex space-x-2 items-center">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<rect width="16" height="16" rx="4" fill="#548DE4" />
					</svg>
					<span className="text-[#344054] text-[14px] font-medium">
						Uncleaned Area
					</span>
				</div>
			</div>
		</div>
	);
};

export default ReportStatus;
