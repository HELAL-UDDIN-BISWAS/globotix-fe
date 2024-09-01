import React from "react";
import { useCountdown } from "@/hooks/useCountdown";

const ShowCount = ({ days, hours, minutes, seconds }) => {
	return (
		<div className="flex">
			<div className="flex text-sm text-black-1">
				<p className="text-[#F04349] text-xs">{("0" + hours).slice(-2)}:</p>
				<p className="text-[#F04349] text-xs">{("0" + minutes).slice(-2)}:</p>
				<p className="text-[#F04349] text-xs">{("0" + seconds).slice(-2)}</p>
			</div>
		</div>
	);
};
const CountTimer = ({ targetDate }) => {
	const [days, hours, minutes, seconds] = useCountdown(parseInt(targetDate));
	if (days + hours + minutes + seconds <= 0) {
		return;
	} else {
		return (
			<ShowCount
				days={days}
				hours={hours}
				minutes={minutes}
				seconds={seconds}
			/>
		);
	}
};
export default CountTimer;
