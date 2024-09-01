import React, { useEffect } from "react";

const ChecboxInput = ({
	color,
	name,
	label,
	value,
	register,
	index,
	field,
	setValue,
}) => {
	const handleChange = (e) => {
		const newValue = [...field?.value];
		if (newValue?.includes(value)) {
			newValue?.splice(newValue.indexOf(value), 1);
		} else {
			newValue?.push(value);
		}
		setValue(name, newValue);
	};

	return (
		<div className="flex space-x-2.5 items-start">
			<input
				id={label + index}
				type="checkbox"
				className="cursor-pointer rounded-2xl"
				{...register(name)}
				value={value}
				checked={field?.value?.includes(value)}
				onChange={handleChange}
			/>
			<label
				style={{ wordBreak: "break-all" }}
				htmlFor={label + index}
				className={`text-sm font-medium cursor-pointer w-full h-full ${
					color ? color : "text-white "
				}`}>
				{label}
			</label>
		</div>
	);
};

export default ChecboxInput;
