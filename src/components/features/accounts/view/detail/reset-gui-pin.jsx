import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import OTPInput from "@/components/form/otp-input";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { yupResolver } from "@hookform/resolvers/yup";

const ResetGuiPin = (props) => {
  const { showToast, showToastError } = useToast();
  const validationSchema = Yup.object().shape({});
  const formOptions = { resolver: yupResolver(validationSchema) };
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm(formOptions);

  const onSubmit = async (data) => {
    if (newPin !== confirmPin) {
      setIsInvalid(true);
      return;
    } else {
      setIsInvalid(false);
    }

    setLoading(true);
    const payload = {
      pin: confirmPin,
    };

    try {
      const response = await api.post(
        `/users/${props.idUser}/change-pin`,
        payload
      );

      if (response?.status === 200) {
        setLoading(false);
        showToast("GUI PIN have been updated");
      } else {
        setLoading(false);
        showToastError("User Error");
      }
    } catch (error) {
      setLoading(false);
      showToastError(
        error?.response?.data?.msg ||
          "Something wrong on server please try again"
      );
    }
  };

  const submitDisable = () => {
    // if (!watch("email") || watch("email") == "") return true;
    // if (!watch("password") || watch("password") == "") return true;
    if (newPin == "" || newPin.length !== 6) return true;
    if (confirmPin == "" || confirmPin.length !== 6) return true;

    return false;
  };

  return (
    <div className="w-full bg-white rounded-[10px] p-2 md:p-5">
      <div className="text-primary font-semibold">Reset GUI PIN</div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
        <div className="flex space-x-5 justify-start items-center">
          <div>
            <label className={`text-xs ${FontHind.className}`}>New PIN</label>
            <OTPInput
              autoFocus
              length={6}
              className="flex flex-row space-x-2"
              inputClassName="otpInput"
              onChangeOTP={(val) => setNewPin(val)}
              placeholder="0"
            />
          </div>

          <div>
            <label className={`text-xs ${FontHind.className}`}>
              Confirm PIN
            </label>
            <OTPInput
              autoFocus
              length={6}
              className="flex flex-row space-x-2"
              inputClassName="otpInput"
              onChangeOTP={(val) => setConfirmPin(val)}
              placeholder="0"
              isInvalid={isInvalid}
            />
          </div>

          <div className="flex flex-col h-full justify-end">
            <label className={`text-xs ${FontHind.className}`}>&nbsp;</label>
            <Button
              disabled={submitDisable()}
              formNoValidate="formnovalidate"
              type="submit"
              loading={loading}
            >
              <span className="text-sm text-white">Update Pin</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetGuiPin;
