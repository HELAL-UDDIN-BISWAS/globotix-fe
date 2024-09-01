import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import Button from "@/components/common/button";
import ChecboxInput from "@/components/form/checkbox.input";
import EmailInput from "@/components/form/email.input";
import PasswordInput from "@/components/form/password.input";
import useAuth from "@/hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import CountTimer from "@/components/countdown/LoginCountdown";

const LoginForm = () => {
	const { login } = useAuth();
	const router = useRouter();
	const [isError, setIsError] = useState(false);
	const [msgError, setMsgError] = useState("");
	const [loading, setLoading] = useState(false);
	const [lockedOutUntil, setLockedOutUntil] = useState(null);

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.required("Email is required")
			.email("Please enter a valid email address"),
		password: Yup.string().required("Password is required"),
	});
	const formOptions = { resolver: yupResolver(validationSchema) };

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm(formOptions);

	const onSubmit = async (data) => {
		if (loading) return;

		setLoading(true);
		setIsError(false);
		const response = await login(data.email, data.password);

		if (response?.status === 200) {
			router.push("/verification");
		} else {
			const { msg, time } = response;
			setLoading(false);
			setIsError(true);
			setMsgError(msg);
			if (msg?.includes("locked")) {
				setLockedOutUntil(time);
			}
		}
	};

	const submitDisable = () => {
		if (!watch("email") || watch("email") === "") return true;
		if (!watch("password") || watch("password") === "") return true;

		return false;
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{isError && msgError?.includes("locked") ? (
					<div className="flex md:flex-row flex-col md:items-center gap-2 mb-6 bg-[#242C32] text-[#C8C5C5] px-[15px] py-2.5 rounded-[8px] text-xs font-medium border-2 border-[#F04349] border-b border-t-0 border-l-0 border-r-0">
						<div
							className="cursor-pointer border border-[#F04349] max-w-[30px] min-w-[30px] w-[30px] p-1 inline-flex items-center justify-center bg-[#F04349] rounded-full"
							onClick={() => {
								setMsgError(null);
								setIsError(!isError);
							}}>
							<RxCross2 color="black" size={18} />
						</div>
						<div>
							<span className="font-semibold text-[#f04349]">
								Your account has been locked
							</span>{" "}
							because you have reached the maximum number of invalid sign-in
							attempts, please try again in{" "}
							<CountTimer targetDate={lockedOutUntil} />{" "}
						</div>
					</div>
				) : (
					isError && (
						<div className="mb-6 bg-red-2 px-[15px] py-2.5 rounded-[10px] text-xs text-black-1">
							{msgError}
						</div>
					)
				)}

				<EmailInput
					label="Email Address"
					register={register}
					name="email"
					placeholder="Type your email"
					isInvalid={errors.email}
					color={"text-white"}
					isRequired
				/>
				<PasswordInput
					label="Password"
					register={register}
					name="password"
					placeholder="Type your password"
					isInvalid={errors.password}
					color={"text-white"}
					isRequired
				/>
				<div className="mt-2.5 mb-[30px] flex justify-between items-center">
					<ChecboxInput
						label="Keep me logged in"
						name="keep_password"
						register={register}
						control={control}
					/>

					<Link className="text-xs underline" href="/forgot-password">
						Forgot Password
					</Link>
				</div>
				<Button
					disabled={submitDisable()}
					formNoValidate="formnovalidate"
					type="submit"
					loading={loading}
					className="bg-primary py-4 px-5 rounded-[10px]">
					<span className="text-sm font-w">Sign In</span>
				</Button>
			</form>
		</>
	);
};

export default LoginForm;
