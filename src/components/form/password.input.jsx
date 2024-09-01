import React, { useState } from "react";

import { FontHind } from "../fonts";
import IconEye from "../icons/iconEye";
import IconEyeClose from "../icons/iconEyeClose";

const PasswordInput = ({
	name,
	label,
	placeholder,
	isRequired,
	isInvalid,
	register,
}) => {
	const [focus, setFocus] = useState(false);
	const [showPass, setShowPass] = useState(false);

	return (
		<>
			<div
				className={`${isInvalid ? "mb-10" : "mb-5"} flex flex-col w-full ${
					FontHind.className
				}`}>
				{label && (
					<label htmlFor="password" className="text-xs">
						{label}
					</label>
				)}
				<div className="relative w-full">
					<input
						id="password"
						type={showPass ? "text" : "password"}
						onFocus={() => setFocus(true)}
						onBlurCapture={() => setFocus(false)}
						className={`${
							isInvalid ? "bg-red-2" : "bg-white"
						} relative z-10 w-full text-sm text-black-1 border-2 border-white-1 rounded-[10px] h-[45px] py-[12px] px-[15px] focus:outline-none`}
						placeholder={placeholder}
						{...register(name, {
							required: isRequired ? true : false,
						})}
					/>

					<div
						onClick={() => setShowPass(!showPass)}
						className="cursor-pointer z-10 w-[15px] h-[11px] object-contain absolute right-[15px] top-1/2 -translate-y-1/2">
						{showPass ? (
							<div className="text-black">
								<IconEyeClose />
							</div>
						) : (
							<div className="text-black">
								<IconEye />
							</div>
						)}
					</div>
					{focus && (
						<div className="absolute top-[3px]  w-full h-[45px] bg-primary rounded-[10px]"></div>
					)}

					{isInvalid && (
						<div className=" text-white absolute text-[11px] px-[15px] py-[5px] flex items-end top-[29px] w-full h-[45px] bg-red-1 rounded-[10px]">
							{isInvalid.message}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default PasswordInput;
