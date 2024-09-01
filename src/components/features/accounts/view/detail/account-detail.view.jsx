import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MdOutlineEdit } from "react-icons/md";

import { FontHind } from "@/components/fonts";
import IconCleaningPlan from "@/components/icons/iconCleaningPlan";
import Page from "@/components/layout/page";
import useAuth from "@/hooks/useAuth";
import useSingleAccount from "@/hooks/useSingleAccount";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";

import ResetFMPassword from "./reset-fm-password";
import { FaChevronLeft } from "react-icons/fa";

const RowDetail = (props) => {
	return (
		<div className={`w-full flex text-sm text-black-1 ${FontHind.className}`}>
			<span className={`font-semibold break-word ${props.width}`}>
				{props.title}:
			</span>
			<span className="break-all">{props.info}</span>
		</div>
	);
};

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

const AccountDetailView = () => {
	const id = useParams();
	const self = useAuth();
	const router = useRouter();
	const { getUserById, user } = useSingleAccount();

	useEffect(() => {
		getUserById({ id: id?.slug[0] });
	}, [id?.slug]);

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
					<div className="flex justify-between items-center space-x-5">
						<div className="flex items-center gap-4">
							<FaChevronLeft
								color="text-primary"
								className="cursor-pointer"
								onClick={() => router?.back()}
							/>
							<span className="text-titleFontColor w-full text-lg font-semibold">
								Detail Account
							</span>
						</div>

						{checkCanEdit() && (
							<Link
								href={"/accounts/edit/" + user?.id}
								className="cursor-pointer text-hyperLinkColor flex items-center gap-2 text-sm">
								<MdOutlineEdit fill="#599CFF" size={18} />{" "}
								<span>Edit Detail</span>
							</Link>
						)}
					</div>
				}>
				<div className="md:space-x-5 px-5 flex flex-col md:flex-row w-full text-black">
					<div className="w-full space-y-2.5">
						<div className="bg-white rounded-[10px] p-2 md:p-5">
							<label className="text-primary font-semibold">
								General Information
							</label>
							<div className="w-full grid md:grid-cols-2 grid-cols-1 mt-4 gap-5">
								<div className="space-y-2">
									<RowDetail
										width="w-[100px]"
										title="Username"
										info={user?.name}
									/>
									<RowDetail width="w-[100px]" title="ID" info={user?.id} />
									<RowDetail
										width="w-[100px]"
										title="Organization"
										info={user?.organization?.name}
									/>
								</div>
								<div className="space-y-2">
									<RowDetail
										width="w-[100px]"
										title="Role"
										info={
											<span className="capitalize">
												{/* {user?.role?.join(", ").toLowerCase()} */}
												{user?.role}
											</span>
										}
									/>
									<RowDetail
										width="w-[100px]"
										title="Email"
										info={user?.email}
									/>
									<RowDetail
										width="w-[100px]"
										title="Mobile No"
										info={user?.phoneCode + user?.phoneNumber}
									/>
								</div>
							</div>
						</div>

						{/* {checkShowFMPassword() && user !== null && (
              <ResetFMPassword user={user} idUser={user?.id} />
            )} */}

						{/* <ResetGuiPin idUser={user?._id} /> */}
					</div>
					<div className="w-full md:max-w-[280px] mt-5 md:mt-0">
						<div className="bg-white-1 w-full rounded-[10px]">
							<div className="w-full h-[50px]">
								<div className="rounded-t-[10px] flex justify-center items-center h-full w-[70px] bg-primary text-white">
									<IconCleaningPlan />
								</div>
							</div>
							<div className="bg-white p-4">
								<label className="text-primary font-semibold text-sm">
									Assigned Building(s)
								</label>
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
							</div>
						</div>
					</div>
				</div>
			</Page>
		</>
	);
};

export default AccountDetailView;
