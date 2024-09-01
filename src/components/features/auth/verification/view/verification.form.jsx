import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import SpinnerCircular from "@/components/common/spinner/spinnerCircular";
import CountdownTimer from "@/components/countdown/CountdownTimer";
import OTPInput from "@/components/form/otp-input";
import useAuth from "@/hooks/useAuth";

import axios from "axios";

const VerificationForm = (props) => {
  const { loginOtp } = useAuth();
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const [expiredTime, setExpiredTime] = useState(new Date().getTime() + 300000);

  const onSubmit = async (otp) => {
    if (otp.length !== 6) return;

    setLoading(true);
    setIsError(false);

    const response = await loginOtp(otp);
    if (response?.status === 200) {
      window.location.pathname = "/dashboard";
    } else {
      setLoading(false);
      setIsError(true);
      setMsgError(response?.data?.message);

      //"The OTP you entered is incorrect. Please check your email & try again"
    }
  };

  const resend = async () => {
    setLoading(true);
    props?.setMsg("");
    try {
      let response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
        {
          email: Cookies.get("email"),
          password: Cookies.get("password"),
        }
      );
      setLoading(false);

      if (response?.status === 200) {
        setCanResend(false);
        props?.setMsg(
          `An OTP has been successfully resent to your email ${Cookies.get(
            "email"
          )}`
        );
        setExpiredTime(new Date().getTime() + 300000);
      } else {
        props?.setMsg(
          `An OTP failed resent to your email ${Cookies.get("email")}`
        );
      }
    } catch (error) {
      setLoading(false);
      props?.setMsg(`An OTP failed sent to ${Cookies.get("email")}`);
    }
  };

  return (
    <>
      <div>
        {isError && (
          <div className="mb-6 bg-red-2 px-[15px] py-2.5 rounded-[10px] text-xs text-black-1">
            {msgError}
          </div>
        )}

        <label className="text-xs text-black-1">OTP</label>
        <OTPInput
          autoFocus
          isNumberInput
          length={6}
          className="flex flex-row justify-between"
          inputClassName="otpInput"
          showEye={false}
          onChangeOTP={(valOtp) => onSubmit(valOtp)}
        />

        <div className="mt-4">
          {loading && (
            <div className="flex justify-start items-start w-5 h-5">
              <SpinnerCircular
                thickness={161}
                speed={174}
                color="rgba(255, 255, 255, 1)"
                secondaryColor="rgba(7, 55, 99, 1)"
              />
            </div>
          )}

          {!loading && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-black-1 flex">
                <CountdownTimer
                  targetDate={expiredTime}
                  setCanResend={() => setCanResend(true)}
                />
              </div>

              {!loading && (
                <div
                  onClick={() => resend()}
                  className="cursor-pointer text-sm text-hyperLinkColor underline"
                >
                  Resend OTP
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificationForm;
