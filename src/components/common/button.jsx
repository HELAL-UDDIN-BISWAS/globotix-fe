import React from "react";
import SpinnerCircular from "./spinner/spinnerCircular";

const Button = (props) => {
	const attr = { ...props };
	delete attr["loading"];
	return (
		<>
			<button
				className={`w-max min-w-[100px] flex items-center justify-center py-4 px-5 h-[${
					props.height ? props.height : "45"
				}px]  rounded-[10px]  ${
					props.disabled
						? "bg-disable"
						: props.bgColor
							? props.bgColor
							: "bg-primary"
				}`}
				{...attr}>
				<div className="flex space-x-2 w-max justify-center items-center font-semibold">
					{props.loading ? (
						<div className="flex justify-center items-center w-5 h-5">
							<SpinnerCircular
								thickness={161}
								speed={174}
								color="rgba(255, 255, 255, 1)"
								secondaryColor="rgba(7, 55, 99, 1)"
							/>
						</div>
					) : (
						<></>
					)}

					{props.children}
				</div>
			</button>
		</>
	);
};

export default Button;
