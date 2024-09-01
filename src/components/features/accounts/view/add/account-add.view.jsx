"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ButtonOptionChoose from "@/components/button/optionChoose.button";
import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import ChecboxInput from "@/components/form/checkbox.input";
import EmailInput from "@/components/form/email.input";
import NumberInput from "@/components/form/number.input";
import PasswordInput from "@/components/form/password.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import IconCleaningPlan from "@/components/icons/iconCleaningPlan";
import Page from "@/components/layout/page";
import ROLE from "@/const/role";
import useAuth from "@/hooks/useAuth";
import useBuilding from "@/hooks/useBuilding";
import useOrganization from "@/hooks/useOrganization";
import { useToast } from "@/hooks/useToast";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import useRoles from "@/hooks/useRoles";
import CheckInput from "@/components/form/checkInput";
import { FaChevronLeft } from "react-icons/fa";

const AccountAddView = () => {
	const { user } = useAuth();
	const { showToast, showToastError } = useToast();
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState(ROLE.USER);
	const router = useRouter();
	const org = useOrganization();
	const building = useBuilding();
	const [listBuilding, setListBuilding] = useState([]);
	const { getRoles, roles } = useRoles();
	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required("Username is required")
			.min(3, "Username must be at least 3 characters long")
			.matches(/^\S*$/, "Username should not contain spaces"),
		email: Yup.string()
			.required("Email is required")
			.email("Please enter a valid email address"),
	});
	const formOptions = { resolver: yupResolver(validationSchema) };

	const [listOrg, setListOrg] = useState([]);

	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors },
	} = useForm(formOptions);

	useEffect(() => {
		getRoles();
	}, []);

	useEffect(() => {
		if (org?.data?.length > 0 && user) {
			let arr = [];
			if (isOnlyAdmin(user?.role)) {
				arr = org.data.filter((v) => {
					if (v.id == user?.organization?.id) {
						return v;
					}
				});

				setListOrg(arr);
				setValue("organization", arr[0]);
			} else {
				const orgData = org?.data?.map((item) => ({
					id: item?.id,
					name: item?.name,
				}));
				setListOrg(orgData);
				setValue("organization", orgData[0]);
			}
		}
	}, [org.data, user, setValue]);
	useEffect(() => {
		setValue("no_ext", { value: "+65", label: "+65" });
	}, []);

	useEffect(() => {
		if (building?.data?.length > 0 && watch("organization") !== undefined) {
			let arr = [...building.data];

			arr = arr
				.filter((item) => item?.organization?.id == watch("organization")?.id)
				.map((item) => ({
					id: item?.id,
					name: item?.name,
				}));

			setListBuilding(arr);
		}
	}, [watch("organization"), building.data]);

	useEffect(() => {
		setValue("building", false);
	}, [listBuilding]);

	const onSubmit = async (data) => {
		if (loading) return;

		/* if (newPin.length !== 6) {
      setPinEmpty(true);
      return;
    } else {
      setPinEmpty(false);
    }

    if (newPin.length !== 6 || newPin !== confirmPin) {
      setPinInvalid(true);
      return;
    } else {
      setPinInvalid(false);
    } */

		setLoading(true);

		const payload = {
			username: data?.name || "",
			// username: data?.username || "",
			email: data?.email || "",
			password: data?.confirm_password || "",
			mobileNumberCode: data?.no_ext?.value || "",
			phoneNumberCode: data?.no_ext?.value || "",
			phoneNumber: data?.phone || "",
			mobileNumber: data?.phone || "",
			buildings:
				data.building === false || data.building === undefined
					? null
					: data.building,
			organization: data?.organization?.name,
			role: role?.name,
		};

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
				payload
			);

			if (response?.status === 200) {
				setTimeout(() => {
					setLoading(false);
					showToast("A new user has been created");
					router.push("/accounts");
				}, 1000);
			} else {
				setLoading(false);
				showToastError("User Error");
			}
		} catch (error) {
			setLoading(false);
			showToastError(
				error?.response?.data?.message ||
					"Something wrong on server please try again"
			);
		}
	};

	// const submitDisable = () => {
	//   if (!watch("new_password") || watch("new_password") == "") return true;
	//   if (!watch("confirm_password") || watch("confirm_password") == "")
	//     return true;

	//   return false;
	// };
	return (
		<>
			<Page
				title={
					<div className="flex items-center gap-4">
						<FaChevronLeft
							color="text-primary"
							className="cursor-pointer"
							onClick={() => router?.back()}
						/>
						<span className="text-titleFontColor w-full text-lg font-semibold">
							New Account
						</span>
					</div>
				}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="px-5 space-x-0 md:space-x-5 flex flex-col md:flex-row w-full text-black">
					<div className="w-full">
						<div className="bg-white rounded-[10px] p-2 md:p-5">
							<label className="text-bodyTextColor text-base font-semibold">
								General Information
							</label>
							<div className="w-full grid grind-cols-1 md:grid-cols-2 gap-5 mt-4">
								<TextInput
									label="Username"
									register={register}
									name="name"
									placeholder="Type your Username"
									isInvalid={errors.name}
									isRequired
								/>

								<SelectInput
									label="Organization"
									register={register}
									name="organization"
									placeholder="Type your organization"
									isInvalid={errors.organization}
									isRequired
									control={control}
									options={listOrg}
								/>

								<EmailInput
									label="Email Address"
									register={register}
									name="email"
									placeholder="Type your email"
									isInvalid={errors.email}
									isRequired
								/>

								<div className="flex  space-x-2">
									<div className="w-36">
										<SelectInput
											label="Mobile No (Optional)"
											register={register}
											name="no_ext"
											placeholder=""
											isInvalid={errors.no_ext}
											control={control}
											options={[
												{ value: "+65", label: "+65" },
												{ value: "+61", label: "+61" },
												{ value: "+81", label: "+81" },
												{ value: "+82", label: "+82" },
												{ value: "+852", label: "+852" },
											]}
											getOptionLabel={(option) => option.label}
											getOptionValue={(option) => option.value}
										/>
									</div>
									<NumberInput
										label="&nbsp;"
										register={register}
										name="phone"
										isInvalid={errors.phone}
									/>
								</div>
								<div className="flex flex-col">
									<label className={`text-xs ${FontHind.className}`}>
										Role
									</label>
									<div className="flex py-1.5 h-[45px] item-center space-x-2.5">
										{(isAdmin(user?.role) || isSuperAdmin(user?.role)) && (
											<>
												<ButtonOptionChoose
													onClick={() =>
														setRole(
															roles.find(
																(item) =>
																	item?.name?.toUpperCase() === ROLE.USER
															)
														)
													}
													active={role?.name?.toUpperCase() === ROLE.USER}
													text="User"
												/>

												<ButtonOptionChoose
													onClick={() =>
														setRole(
															roles.find(
																(item) =>
																	item?.name?.toUpperCase() === ROLE.ADMIN
															)
														)
													}
													active={role?.name?.toUpperCase() === ROLE.ADMIN}
													text="Admin"
												/>
											</>
										)}

										{/* {isSuperAdmin(user?.role) && (
                      <ButtonOptionChoose
                        onClick={() =>
                          setRole(
                            roles.find(
                              (item) =>
                                item?.name?.toUpperCase() === ROLE.SUPERADMIN
                            )
                          )
                        }
                        active={role?.name?.toUpperCase() === ROLE.SUPERADMIN}
                        text="Super Admin"
                      />
                    )} */}
									</div>
								</div>
							</div>
						</div>

						{/* <div className="bg-white rounded-[10px] p-2 md:p-5 mt-5">
              <div className="text-bodyTextColor text-base font-semibold">
                Password
              </div>
              <div
                className={`text-black-1 text-sm ${FontHind.className} mt-4`}
              >
                The password should contain at least 8 characters with at least
                1 upper case , 1 lower case, 1 number, and 1 special character.
              </div>
              <div className="w-full mt-4">
                <div className="w-full">
                  <div className="flex space-x-5">
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
                   
                  </div>
                </div>
              </div>
            </div> */}

						{/* <div className="w-full bg-white rounded-[10px] p-2 md:p-5 mt-5">
              <div className="text-primary font-semibold">GUI PIN</div>

              <div className="w-full mt-4">
                <div className="flex space-x-5">
                  <div>
                    <label className={`text-xs ${FontHind.className}`}>
                      New PIN
                    </label>
                    <OTPInput
                      autoFocus
                      length={6}
                      className="flex flex-row space-x-2"
                      inputClassName="otpInput"
                      onChangeOTP={(val) => setNewPin(val)}
                      placeholder="0"
                      isEmpty={pinEmpty}
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
                      isEmpty={pinEmpty}
                      isInvalid={pinInvalid}
                    />
                  </div>
                </div>
              </div>
            </div> */}

						<div className="flex space-x-5 mt-10">
							<button
								onClick={
									!loading
										? () => {
												router.push("/accounts");
											}
										: () => {}
								}
								type="button"
								className={`w-max border border-primary font-semibold flex items-center justify-center py-4 px-5 h-[45px] rounded-[10px] bg-primary02 `}>
								<div className="flex space-x-2 w-max justify-center items-center text-primary">
									Cancel
								</div>
							</button>
							<Button
								loading={loading}
								formNoValidate="formnovalidate"
								type="submit">
								<span className="text-sm text-white">Create</span>
							</Button>
						</div>
					</div>
					<div className="w-full ms-0 md:max-w-[280px] mt-8 md:mt-0">
						<div className="bg-white-1 w-full rounded-[10px]">
							<div className="w-full h-[50px]">
								<div className="rounded-t-[10px] flex justify-center items-center h-full w-[70px] bg-primary text-white">
									<IconCleaningPlan />
								</div>
							</div>
							<div className="bg-white p-4">
								<label className="text-primary text-xs">
									Assign building(s) to the user
								</label>
								<div className="mt-4">
									<div className="flex flex-col space-y-2.5">
										{listBuilding?.map((item, key) => (
											<CheckInput
												key={key}
												index={key}
												label={item.name}
												value={item.id}
												name={"building"}
												register={register}
												control={control}
												color="text-black-1"
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</Page>
		</>
	);
};

export default AccountAddView;
