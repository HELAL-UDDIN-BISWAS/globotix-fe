"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import PasswordInput from "@/components/form/password.input";
import api from "@/utils/api.axios";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");
  const [isError, setIsError] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("New Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,}$/,
        "Your password doesn’t meet the requirements"
      ),
    confirm_password: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Your passwords need to match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm(formOptions);

  const onSubmit = async (data) => {
    if (loading) return;
    setIsError(false);
    setIsSuccess(false);
    setLoading(true);

    const payload = {
      code: code || "",
      password: data?.password,
      passwordConfirmation: data?.confirm_password || "",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        payload
      );
      setLoading(false);
      if (response?.status === 200) {
        setMsgSuccess(
          "A password has been reset successfully, this page will redirect to login page within 5 second"
        );
        setIsSuccess(true);

        setTimeout(() => {
          router.push("/login");
          setLoading(false);
        }, 5000);
      } else {
        reset();
        setIsError(true);
        setMsgError(
          response?.response?.data?.message ||
            "Something wrong on server please try again"
        );
      }
    } catch (error) {
      setIsError(true);
      setLoading(false);
      setMsgError(
        error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  const submitDisable = () => {
    if (!watch("password") || watch("password") == "") return true;
    if (!watch("confirm_password") || watch("confirm_password") == "")
      return true;

    return false;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isError && (
          <div className="mb-6 bg-red-2 px-[15px] py-2.5 rounded-[10px] text-xs text-black-1">
            {msgError}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 bg-green-1 px-[15px] py-2.5 rounded-[10px] text-xs text-black-1">
            {msgSuccess}
          </div>
        )}

        <PasswordInput
          label="New Password"
          register={register}
          name="password"
          placeholder="Type your new password"
          isInvalid={errors.password}
          color={"text-white"}
          isRequired
        />
        <PasswordInput
          label="Confirm Password"
          register={register}
          name="confirm_password"
          placeholder="Type your confirm password"
          isInvalid={errors.confirm_password}
          color={"text-white"}
          isRequired
        />
        <div className="mt-8"></div>
        <Button
          disabled={submitDisable()}
          formNoValidate="formnovalidate"
          type="submit"
          loading={loading}
          className="bg-primary py-4 px-5 rounded-[10px]"
        >
          <span>Reset Password</span>
        </Button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
