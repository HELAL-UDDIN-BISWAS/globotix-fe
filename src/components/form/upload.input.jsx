import { useEffect, useState } from "react";

import ButtonIcon from "../button/icon.button";
import SpinnerCircular from "../common/spinner/spinnerCircular";

import IconTrash from "../icons/iconTrash";
import { FontHind } from "../fonts";

const UploadInput = ({
  setLogo = () => {},
  label,
  placeholder,
  isInvalid,
  color,
  otherInfo,
  actionOtherInfo,
  value,
  canDelete = true,
}) => {
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (value !== undefined && value !== "") {
      setFile(`${process.env.NEXT_PUBLIC_API_URL}${value}`);
    } else {
      setFile(null);
    }
  }, [value]);

  const onFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      let file = event.target.files[0];
      setLogo(file);
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div
        className={`${isInvalid ? "mb-10" : "mb-5"} flex flex-col w-full ${
          FontHind.className
        }`}
      >
        {label && (
          <div className="flex justify-between">
            <label className={`text-xs ${color ? color : "text-black-1"}`}>
              {label}
            </label>

            {otherInfo && (
              <label
                onClick={() => actionOtherInfo()}
                className={`cursor-pointer text-xs text-primary underline`}
              >
                {otherInfo}
              </label>
            )}
          </div>
        )}

        {file === null ? (
          <div className="relative w-full">
            <div className="my-1">
              <input
                hidden
                id="inputBtn"
                type="file"
                onChange={(e) => onFileChange(e)}
                accept="image/png, image/jpg, image/jpeg, image/tiff"
              />
              <label
                htmlFor="inputBtn"
                className={`cursor-pointer w-max flex items-center justify-center py-4 px-5 h-[45px]  rounded-[10px] bg-primary`}
              >
                <div className="flex space-x-2 w-max justify-center items-center font-semibold text-sm text-white">
                  {loading ? (
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
                  Upload Image
                </div>
              </label>
            </div>
            <label className={`text-xs ${color ? color : "text-black-1"}`}>
              {placeholder}
            </label>
            {focus && (
              <div className="absolute top-[3px]  w-full h-[45px] bg-[#0944A1] rounded-[10px]"></div>
            )}

            {isInvalid && (
              <div className="text-white absolute text-[11px] px-[15px] py-[5px] flex items-end top-[29px] w-full h-[45px] bg-red-1 rounded-[10px]">
                {isInvalid.message}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center w-full mt-2">
            <img
              src={file || ""}
              className="w-full h-full max-w-[80%] max-h-[100px] object-contain"
              alt=""
              height={70}
              width={70}
            />
            {canDelete && (
              <ButtonIcon
                onClick={() => setFile(null)}
                icon={<IconTrash />}
                color="text-red-1"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadInput;
