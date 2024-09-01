import { IoIosRadioButtonOn, IoIosRadioButtonOff } from "react-icons/io";
import { FontHind } from "../fonts";

const RadioInput = ({ name, register, options, value, setValue }) => {
  return (
    <>
      {options?.map((item, key) => {
        const isChecked = item.value === value;

        return (
          <label
            key={key}
            className={`cursor-pointer ${FontHind.className} flex items-center text-bodyTextColor`}
            htmlFor={item.id}
            onClick={() => {
              setValue(item.value);
            }}
          >
            <input
              {...register(item.name)}
              type="radio"
              value={item.value}
              id={item.id}
              checked={isChecked}
              className="hidden"
            />
            <span className="cursor-pointer">
              {isChecked ? (
                <IoIosRadioButtonOn size={20} className="text-primary" />
              ) : (
                <IoIosRadioButtonOff size={20} className="text-bodyTextColor" />
              )}
            </span>
            <span
              className={`ml-2.5 ${
                isChecked && "text-primary"
              } text-base font-medium mt-1`}
            >
              {item.label}
            </span>
          </label>
        );
      })}
    </>
  );
};

export default RadioInput;
