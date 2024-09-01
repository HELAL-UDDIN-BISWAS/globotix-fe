"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

import ButtonOptionChoose from "@/components/button/optionChoose.button";
import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import ChecboxInput from "@/components/form/checkbox.input";
import EmailInput from "@/components/form/email.input";
import NumberInput from "@/components/form/number.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import IconCleaningPlan from "@/components/icons/iconCleaningPlan";
import Page from "@/components/layout/page";
import ROLE from "@/const/role";
import STATUS from "@/const/status";
import useAuth from "@/hooks/useAuth";
import useBuilding from "@/hooks/useBuilding";
import useOrganization from "@/hooks/useOrganization";
import useSingleAccount from "@/hooks/useSingleAccount";
import { useToast } from "@/hooks/useToast";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import useRoles from "@/hooks/useRoles";
import ResetFMPassword from "../detail/reset-fm-password";
import { FaChevronLeft } from "react-icons/fa";
import CheckInput from "@/components/form/checkInput";
const CardAssignLocation = (props) => {
	return (
		<div>
			<div
				className={`p-4 border border-gray rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}>
				<div className="font-semibold min-w-[120px]">{props.title}</div>
				<div>{props.info}</div>
			</div>
		</div>
	);
};
const AccountEditView = () => {
	const { showToast, showToastError } = useToast();
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState();
	const [status, setStatus] = useState();
	const router = useRouter();
	const { slug } = useParams();
	const org = useOrganization();
	const building = useBuilding();
	const [listBuilding, setListBuilding] = useState([]);

	const self = useAuth();

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

	const { getUserById, user, updateUser } = useSingleAccount();
	const { getRoles, roles } = useRoles();
	useEffect(() => {
		getUserById({ id: slug[0] });
	}, [slug]);

	useEffect(() => {
		getRoles();
	}, []);
	const isUserRole = () => {
		if (self?.user?.id == user?.id && self?.user?.role == "user") {
			return true;
		} else {
			return false;
		}
	};
	useEffect(() => {
		if (org?.data?.length > 0 && self) {
			let arr = [];
			if (isOnlyAdmin(self?.user?.role)) {
				arr = org?.data.filter((v) => {
					if (v.id == self?.user?.organization?.id) {
						return v;
					}
				});

				setListOrg(arr);
				// setValue("organization", self?.user?.organization);
			} else {
				const orgData = org?.data?.map((item) => ({
					id: item?.id,
					name: item?.name,
				}));
				setListOrg(orgData);
				// setValue("organization", self?.user?.organization);
			}
		}
	}, [org?.data, self]);

	useEffect(() => {
		if (user) {
			setValue("name", user?.name);
			setValue("email", user?.email);
			// setValue("username", user?.username);
			setValue("no_ext", {
				value: user?.phoneCode,
				label: user?.phoneCode,
			});
			setValue("phone", user?.phoneNumber);
			setValue("organization", user?.organization);

			setStatus(
				user?.status?.toLowerCase() === STATUS.ACTIVE
					? STATUS.ACTIVE
					: STATUS.INACTIVE
			);
			setRole(
				isSuperAdmin(user?.role)
					? roles?.find((item) => item?.name?.toUpperCase() === ROLE.SUPERADMIN)
					: isOnlyAdmin(user?.role)
						? roles?.find((item) => item?.name?.toUpperCase() === ROLE.ADMIN)
						: roles?.find((item) => item?.name?.toUpperCase() === ROLE.USER)
			);
		} else {
			setValue("no_ext", { value: "+65", label: "+65" });
		}
	}, [user?.id]);

	useEffect(() => {
		if (building?.data?.length > 0) {
			let arr = [...building.data];

			arr = arr
				.filter((item) => item?.organization?.id == watch("organization")?.id)
				.map((item) => ({
					id: item?.id,
					name: item?.name,
				}));

			setListBuilding(arr);
		}
	}, [watch("organization"), building?.data]);

	useEffect(() => {
		if (
			watch("organization")?.id != undefined &&
			watch("organization")?.id == user?.organization?.id &&
			user?.building?.length > 0
		) {
			setValue(
				"building",
				user?.building.map((item) => item.id)
			);
		} else {
			setValue("building", false);
		}
	}, [listBuilding]);

	const onSubmit = async (data) => {
		if (loading) return;

		setLoading(true);

		const payload = {
			username: data?.name || "",
			email: data?.email || "",
			role: role?.id,
			status: status?.toLowerCase(),
			organization: data?.organization?.id,
			buildings:
				data.building === false || data.building === undefined
					? []
					: data.building,

			mobileNumberCode: data?.no_ext?.value || "",
			mobileNumber: data?.phone || "",
		};

		try {
			const response = await updateUser({ id: user?.id, payload: payload });

			if (response?.status === 200) {
				setTimeout(() => {
					setLoading(false);
					showToast("User details have been updated");
					isUserRole() ? router?.back() : router.push("/accounts");
				}, 1000);
			} else {
				setLoading(false);
				showToastError(response);
			}
		} catch (error) {
			setLoading(false);
			showToastError(
				error?.response?.data?.message ||
					"Something wrong on server please try again"
			);
		}
	};
	const checkShowFMPassword = () => {
		if (isOnlyAdmin(self?.user?.role)) {
			if (isSuperAdmin(user?.role)) {
				return false;
			}
		}

		return true;
	};

	const checkCanEdit = () => {
		if (isAdmin(self?.user?.role)) {
			if (isSuperAdmin(self?.user?.role)) {
				// If the user is a superadmin, they can edit anything
				return true;
			} else if (user?.role !== "superadmin") {
				// If the user is an admin but not a superadmin, they cannot edit superadmin
				return true;
			}
			return false;
		}

		if (self?.user?.id == user?.id) {
			return true;
		}

		return false;
	};

	return (
		<>
			<Page
				title={
					<div className="flex items-center gap-4">
						<FaChevronLeft
							color="text-primary"
							className="cursor-pointer"
							onClick={() =>
								isUserRole() ? router?.back() : router?.push("/accounts")
							}
						/>
						<span className="text-titleFontColor w-full text-lg font-semibold">
							Edit Account
						</span>
					</div>
				}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="md:space-x-5 px-5 flex flex-col md:flex-row w-full text-black">
					<div className="w-full flex flex-col gap-3">
						<div className="bg-white rounded-[10px] p-2 md:p-5">
							<label className="text-primary font-semibold">
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
									disabled={isUserRole()}
								/>

								<EmailInput
									label="Email Address"
									register={register}
									name="email"
									placeholder="Type your email"
									isInvalid={errors.email}
									isRequired
								/>
								<div className="flex items-center space-x-2">
									<div className="w-36">
										<SelectInput
											label="Mobile No"
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
									<div className="mb-1">
										<NumberInput
											label={<span className="text-sm">&nbsp;</span>}
											register={register}
											name="phone"
											isInvalid={errors.phone}
										/>
									</div>
								</div>

								{(isAdmin(self?.user?.role) ||
									isSuperAdmin(self?.user?.role)) && (
									<div className="flex flex-col">
										<label className={`text-xs ${FontHind.className}`}>
											Role
										</label>
										<div className="flex py-1.5 h-[45px] item-center space-x-2.5">
											{(isAdmin(self?.user?.role) ||
												isSuperAdmin(self?.user?.role)) && (
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

											{/* {isSuperAdmin(self?.user?.role) && (
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
								)}

								{isAdmin(self?.user?.role) && self?.user?.id != user?.id && (
									<div className="flex flex-col">
										<label className={`text-xs ${FontHind.className}`}>
											Status
										</label>
										<div className="flex py-1.5 h-[45px] item-center space-x-2.5">
											<ButtonOptionChoose
												onClick={() => setStatus(STATUS.ACTIVE)}
												active={status === STATUS.ACTIVE}
												text="Active"
											/>

											<ButtonOptionChoose
												onClick={() => setStatus(STATUS.INACTIVE)}
												active={status === STATUS.INACTIVE}
												text="Inactive"
											/>
										</div>
									</div>
								)}
							</div>{" "}
						</div>
						{checkCanEdit() && (
							<div className="flex space-x-5 my-4 w-full">
								<SecondaryButton
									onClick={
										!loading
											? () => {
													router.back();
												}
											: () => {}
									}
									type="button"
									className={` py-3 px-5 rounded-[10px] bg-primary02 border border-primary min-w-[100px] w-max flex items-center justify-center`}>
									<div className="text-sm text-primary">Cancel</div>
								</SecondaryButton>
								<Button
									loading={loading}
									formNoValidate="formnovalidate"
									type="submit">
									<span className="text-sm text-white">Save Changes</span>
								</Button>
							</div>
						)}
					</div>
					<div className="w-full md:max-w-[280px] mt-5 md:mt-0">
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
								{isUserRole() ? (
									<div className="mt-4 space-y-2.5">
										{user?.building?.map((item, key) => (
											<CardAssignLocation
												key={key}
												title={item?.name}
												id={item?.id}
												info="0 location"
											/>
										))}
									</div>
								) : (
									<div className="mt-4">
										<div className="flex flex-col space-y-2.5">
											{listBuilding?.map((item, key) => (
												<CheckInput
													key={key}
													index={key}
													label={item?.name}
													value={item?.id}
													name={"building"}
													register={register}
													control={control}
													color="text-black-1"
												/>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</form>
				<div className="flex mt-3 space-x-5 px-5 w-full">
					{checkShowFMPassword() && user !== null && (
						<ResetFMPassword user={user} idUser={user?.id} />
					)}
				</div>
			</Page>
		</>
	);
};

export default AccountEditView;
