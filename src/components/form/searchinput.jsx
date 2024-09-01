import { useState } from "react";

import { FontHind } from "../fonts";
import IconHistory from "../icons/iconHistory";
import IconSearch from "../icons/iconSearch";

const SearchInput = ({
	name,
	label,
	placeholder,
	isRequired,
	isInvalid,
	register,
	otherAction,
}) => {
	const [focus, setFocus] = useState(false);

	return (
		<>
			<div
				className={`${isInvalid ? "mb-0" : "mb-0"} flex flex-col w-full ${
					FontHind.className
				}`}>
				{label && <label className="text-xs">{label}</label>}
				<div className="relative w-full">
					<div className="flex">
						<div className="w-full relative group rounded-[10px] overflow-hidden">
							<input
								type="text"
								onFocus={() => setFocus(true)}
								onBlurCapture={() => setFocus(false)}
								className={` ${
									isInvalid ? "bg-red-2" : "bg-white"
								} relative w-full text-sm text-bodyTextColor border-none rounded-[10px] h-[45px] py-[12px] px-[15px] pr-[40px] focus:outline-none shadow-input-shadow`}
								placeholder={placeholder}
								{...register(name, {
									required: isRequired ? true : false,
								})}
							/>

							<div className="cursor-pointer absolute z-10 flex justify-center items-center h-[45px] w-[45px] top-0 right-0  text-primary">
								<IconSearch />
							</div>
							{/* {focus && (
								<div className="absolute top-[3px]  w-full h-[45px] bg-primary rounded-[10px]"></div>
							)} */}
							<div className="absolute pointer-events-none inset-x-0 bottom-0 h-[3px] bg-transparent group-focus-within:bg-primary transition-colors duration-200 ease-out"></div>
						</div>
						{otherAction && (
							<div className="cursor-pointer   flex justify-center items-center h-[45px] w-[45px] text-primary">
								<IconHistory />
							</div>
						)}
					</div>

					{isInvalid && (
						<div className="text-white absolute text-[11px] px-[15px] py-[5px] flex items-end top-[29px] w-full h-[45px] bg-red-1 rounded-[10px]">
							{isInvalid.message}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default SearchInput;
