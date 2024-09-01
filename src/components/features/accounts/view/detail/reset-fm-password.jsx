import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import PasswordInput from "@/components/form/password.input";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { LuKeyRound } from "react-icons/lu";

const ResetFMPassword = (props) => {
  const self = useAuth();
  const { showToast, showToastError } = useToast();
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    new_password: Yup.string()
      .required("New Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Your password doesn’t meet the requirements"
      ),
    confirm_password: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("new_password")], "Your passwords need to match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm(formOptions);

  // const onSubmit = async (data) => {
  //   if (loading) return;

  //   setLoading(true);
  //   const payload = {
  //     currentPassword: data?.curr_password,
  //     password: data?.new_password,
  //     passwordConfirmation: data?.confirm_password,
  //   };

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/users/${props?.idUser}/change-password`,
  //       payload,
  //       {
  //         headers: {
  //           authorization: `Bearer ${self?.user?.accessToken}`,
  //         },
  //       }
  //     );

  //     if (response?.data?.message === "Password changed successfully!") {
  //       setLoading(false);
  //       showToast("Password have been updated");
  //       reset();
  //     } else {
  //       setLoading(false);
  //       showToastError("User Error");
  //     }
  //   } catch (error) {
  //     console.log("errr", error);

  //     setLoading(false);
  //     showToastError(
  //       error?.response?.data?.message ||
  //         "Something wrong on server please try again"
  //     );
  //   }
  // };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    const payload = {
      email: props?.user?.email || "",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        payload
      );
      setLoading(false);
      if (response?.status === 200) {
        showToast("A password reset link has been sent to the email");
      } else {
        setLoading(false);
        showToastError(
          response?.response?.data?.message ||
            "Something wrong on server please try again"
        );
      }
    } catch (error) {
      setLoading(false);
      showToastError(
        error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  const submitDisable = () => {
    if (showCurrentPassword()) {
      if (!watch("curr_password") || watch("curr_password") == "") return true;
    }

    if (!watch("new_password") || watch("new_password") == "") return true;
    if (!watch("confirm_password") || watch("confirm_password") == "")
      return true;

    return false;
  };

  const showCurrentPassword = () => {
    if (isSuperAdmin(self?.user?.role)) {
      if (isSuperAdmin(props?.user?.role) || self?.user?._id === props.idUser) {
        return true;
      }
    } else if (isOnlyAdmin(self?.user?.role)) {
      if (isOnlyAdmin(props?.user?.role) || self?.user?._id === props.idUser) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="w-full bg-white rounded-[10px] p-2 md:p-5">
      <div className="text-black-1 font-semibold">Reset Password</div>
      <div className={`text-black-1 text-sm ${FontHind.className} mt-4`}>
        You can reset password by clicking the button below.
      </div>
      <div className="w-full mt-4">
        <form className="w-full">
          {/* {props?.user !== null && showCurrentPassword() && (
            <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
              <PasswordInput
                label="Current Password"
                register={register}
                name="curr_password"
                placeholder="Enter Current Password"
                isInvalid={errors.curr_password}
                color={"text-white"}
                isRequired
              />
            </div>
          )}

          <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
            <PasswordInput
              label="New Password"
              register={register}
              name="new_password"
              placeholder="Enter New Password"
              isInvalid={errors.new_password}
              color={"text-white"}
              isRequired
            />
            <PasswordInput
              label="Confirm Password"
              register={register}
              name="confirm_password"
              placeholder="Retype Password"
              isInvalid={errors.confirm_password}
              color={"text-white"}
              isRequired
            />

            <div>
              <div className="mt-4"></div>
              <Button
                disabled={submitDisable()}
                formNoValidate="formnovalidate"
                loading={loading}
                type="submit"
              >
                <span className="text-sm text-white">Update Password</span>
              </Button>
            </div>
          </div> */}
          <button
            formNoValidate="formnovalidate"
            loading={loading}
            onClick={onSubmit}
            type="submit"
            className="bg-[#EBECEE] w-max min-w-[100px] flex items-center justify-center py-3 px-5 h-45 rounded-[30px]"
          >
            <span className=" text-primary flex items-center font-semibold text-base gap-2">
              <LuKeyRound color="#BFA01D" />
              Reset Password
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetFMPassword;
