import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import EmailInput from "@/components/form/email.input";
import api from "@/utils/api.axios";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email address"),
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

    setLoading(true);
    setIsError(false);
    setIsSuccess(false);

    const payload = {
      email: data?.email || "",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        payload
      );
      setLoading(false);
      if (response?.status === 200) {
        setMsgSuccess("A password reset link has been sent to the email");
        setIsSuccess(true);
      } else {
        reset();
        setIsError(true);
        setMsgError(
          response?.response?.data?.message ||
            "Something wrong on server please try again"
        );
      }
    } catch (error) {
      setLoading(false);
      setIsError(true);
      setMsgError(
        error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  const submitDisable = () => {
    if (!watch("email") || watch("email") == "") return true;

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

        {!isSuccess && (
          <>
            <EmailInput
              label="Email Address"
              register={register}
              name="email"
              placeholder="Type your email"
              isInvalid={errors.email}
              isRequired
            />
            <div className="mt-8"></div>
            <Button
              disabled={submitDisable()}
              formNoValidate="formnovalidate"
              type="submit"
              loading={loading}
            >
              <span>Reset Password</span>
            </Button>
          </>
        )}

        {isSuccess && (
          <>
            <div className="bg-gray rounded-[10px] py-2.5 px-4">
              <span className="text-black-1">{watch("email")}</span>
            </div>
            <div className="mt-8"></div>
            <Button onClick={() => router.push("/login")}>
              <span>Back to login page</span>
            </Button>
          </>
        )}
      </form>
    </>
  );
};

export default ForgotPasswordForm;
