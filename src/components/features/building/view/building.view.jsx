"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import ButtonOptionChoose from "@/components/button/optionChoose.button";
import Button from "@/components/common/button";
import SearchInput from "@/components/form/searchinput";
import Page from "@/components/layout/page";
import DeleteModal from "@/components/modal/delete.modal";
import useAuth from "@/hooks/useAuth";
import useBuilding from "@/hooks/useBuilding";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { isAdmin, isOnlyAdmin, isSuperAdmin, isUserRole } from "@/utils/helper";

import TableBuilding from "./building.table";
import ViewBuildingDetail from "./ViewBuildingDetail";
import axios from "axios";
import FilterButton from "./FilterButton";
import { BiReset } from "react-icons/bi";

const BuildingView = () => {
	const { user } = useAuth();
	const [status, setStatus] = useState("Active");
	const [openDelete, setOpenDelete] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [openView, setOpenView] = useState(false);
	const [viewItem, setViewItem] = useState(null);
	const [listBuilding, setListBuilding] = useState(null);
	const [filters, setFilters] = useState();
	const [isReseted, setIsReseted] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [submitFilter, setSubmitFilter] = useState(null);
	const [assignedBuildings, setAssignedBuildings] = useState(null);
	const building = useBuilding();
	const { showToast } = useToast();
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {};

	useEffect(() => {
		if (isOnlyAdmin(user?.role) || isUserRole(user?.role)) {
			const userBuildings = user?.buildings?.map((b) => b?.id) || [];
			setAssignedBuildings(userBuildings);
		}
	}, [user]);

	useEffect(() => {
		const fetchBuildings = async () => {
			await building.fetchData(
				watch("search"),
				submitFilter,
				assignedBuildings
			);
		};

		fetchBuildings();
	}, [watch("search"), submitFilter, assignedBuildings]);

	useEffect(() => {
		if (building.data) {
			setListBuilding(building?.data);
		}
	}, [building.data]);

	// const handleDelete = async () => {
	//   if (Array.isArray(selectedId)) {
	//     handleMultipleDelete();
	//   } else {
	//     handleSingleDelete();
	//   }
	// };

	const resetFilter = () => {
		setSubmitFilter([]);
		setFilters([]);
		setOpenModal(false);
		setIsReseted(!isReseted);
	};

	const handleView = (val) => {
		setOpenView(!openView);
		setViewItem(val);
	};

	const handleFilter = (val) => {
		setFilters({ ...filters, ...val });
	};

	const applyFilter = () => {
		setIsReseted(false);
		setSubmitFilter(filters);
	};
	const closeFilterModal = () => {
		setOpenModal(false);
		setIsReseted(false);
	};

	return (
		<>
			<DeleteModal
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				onDelete={() => handleDelete()}
				loading={loadingDelete}
			/>
			<ViewBuildingDetail
				open={openView}
				onClose={() => setOpenView(false)}
				viewItem={viewItem}
			/>
			<Page title={"Organizations"}>
				<div className="flex flex-col px2 md:px-5">
					<div className="w-full flex justify-between mb-3">
						<div className="flex space-x-5">
							<form onSubmit={handleSubmit(onSubmit)}>
								<SearchInput
									register={register}
									name="search"
									placeholder="Search Building"
									isInvalid={errors.search}
									color={"text-white"}
								/>
							</form>
							<div className="z-50" onClick={() => setOpenModal(!openModal)}>
								<FilterButton
									handleFilter={handleFilter}
									applyFilter={applyFilter}
									resetFilter={resetFilter}
									filter={filters}
									isReseted={isReseted}
									openModal={openModal}
									toggle={() => closeFilterModal}
								/>
							</div>
							<div
								className="flex items-center gap-1 cursor-pointer"
								onClick={() => resetFilter()}>
								<span className="text-hyperLinkColor border border-t-0 border-l-0 border-r-0 border-b-hyperLinkColor">
									Reset
								</span>
								<BiReset fill="#599CFF" />
							</div>
							{/* 
              <div className="flex py-1.5 h-[45px] item-center space-x-2.5">
                <ButtonOptionChoose
                  onClick={() => setStatus("Active")}
                  active={status === "Active"}
                  text="Active"
                />

                <ButtonOptionChoose
                  onClick={() => setStatus("Inactive")}
                  active={status === "Inactive"}
                  text="Inactive"
                />
              </div> */}
						</div>
						{isAdmin(user?.role) && (
							<Link href="/organization/add">
								<Button>
									<span className="text-sm text-white">+ New Building</span>
								</Button>
							</Link>
						)}
					</div>
					<TableBuilding
						data={listBuilding || []}
						onDelete={(val) => handleOpenDelete(val)}
						onBulkDelete={(val) => handleOpenDelete(val)}
						onView={(val) => handleView(val)}
					/>
				</div>
			</Page>
		</>
	);
};

export default BuildingView;
