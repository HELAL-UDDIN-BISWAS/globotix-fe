import React from "react";
const SpinnerCircular = ({
	secondaryColor,
	speed,
	still,
	thickness,
	...svgProps
}) => {
	const strokeWidth = 4 * (thickness / 100);
	const circleStyle = !still
		? {
				animation: `spinners-react-circular-fixed ${
					140 / speed
				}s linear infinite`,
			}
		: {};

	return (
		<svg fill="none" {...svgProps} viewBox="0 0 66 66">
			<circle
				cx="33"
				cy="33"
				fill="none"
				r="28"
				stroke={secondaryColor}
				strokeWidth={strokeWidth}
			/>
			<circle
				cx="33"
				cy="33"
				fill="none"
				r="28"
				stroke="currentColor"
				strokeDasharray="40, 134"
				strokeDashoffset="325"
				strokeLinecap="round"
				strokeWidth={strokeWidth}
				style={circleStyle}
			/>
		</svg>
	);
};

export default SpinnerCircular;
