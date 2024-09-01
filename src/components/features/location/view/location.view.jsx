"use client";
import Page from "@/components/layout/page";
import { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import SearchInput from "@/components/form/searchinput";

import { getAllCleaningPlan } from "../mocks/cleaningPlans.data";

import useAuth from "@/hooks/useAuth";
import { isAdmin } from "@/utils/helper";
import TableLocation from "./location.table";
import DeleteModal from "@/components/modal/delete.modal";
import useBuilding from "@/hooks/useBuilding";

import { useRouter } from "next/navigation";
import useLocation from "@/hooks/useLocation";
import ViewLocationModal from "./ViewLocationModal";
import EditLocationModal from "./edit/EditLocationForm";
import { useToast } from "@/hooks/useToast";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import FilterButton from "./FilterButton";
import { BiReset } from "react-icons/bi";
import { v4 as uuid } from "uuid";
import { isOnlyAdmin, isSuperAdmin, isUserRole } from "@/utils/helper";
const socket = io(API_URL, { transport: ["websocket"] });

const LocationView = ({
	selectedLocation,
	setSelectedLocation,
	setIsZoneManagement,
	refresh,
}) => {
	const router = useRouter();
	const [listBuilding, setListBuilding] = useState([]);
	const [openDelete, setOpenDelete] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const { user } = useAuth();
	const building = useBuilding();
	const location = useLocation();
	const [listLocation, setListLocation] = useState([]);
	const [viewData, setViewData] = useState(false);
	const [openView, setOpenView] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [editData, setEditData] = useState(false);
	const { showToast, showToastError } = useToast();
	const {
		register,
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { errors },
	} = useForm();
	const [filter, setFilter] = useState({});
	const [filters, setFilters] = useState({
		building: [],
		map: [],
	});
	const [submitFilter, setSubmitFilter] = useState(null);
	const [isReseted, setIsReseted] = useState(false);
	const onSubmit = (data) => {};

	const [dataTable, setDataTable] = useState([]);

	const [query, setQuery] = useState({
		page: 1,
		keywords: "",
		pageSize: 10,
	});

	const handleSearch = (keywords) => {
		setQuery({ ...query, keywords: keywords });
	};

	const handlePageChange = (page) => {
		setQuery({ ...query, page: page });
	};

	socket.on("robot-flexadev-queue", (arg) => {
		if (arg.table_name === "location") {
			location.fetchData(watch("search"));
		}
	});

	useEffect(() => {
		if (isAdmin(user?.role)) {
			if (building?.data) {
				let p = [...building?.data];
				p.sort(function (a, b) {
					if (a?.name < b?.name) {
						return -1;
					}
					if (a.name > b.name) {
						return 1;
					}
					return 0;
				});
				let list = [...[{ id: "0", name: "All Buildings" }], ...p];

				if (router?.query?.building !== undefined) {
					let pb = list?.find((item) => item?.id === router?.query?.building);
					setValue("building", pb);
				} else {
					setValue("building", list[0]);
				}

				setListBuilding(list);
			}
		} else {
			if (user?.building) {
				let d = [...user?.building];
				d.sort(function (a, b) {
					if (a?.name < b?.name) {
						return -1;
					}
					if (a?.name > b?.name) {
						return 1;
					}
					return 0;
				});

				let list = [...[{ _id: "0", name: "All Buildings" }], ...d];

				if (router?.query?.building !== undefined) {
					let db = list.find((item) => item?.id === router?.query?.building);
					setValue("building", db);
				} else {
					setValue("building", list[0]);
				}

				setListBuilding(list);
			}
		}
	}, [user, building.data, router?.query?.building]);

	useEffect(() => {
		handleGetAllData();
	}, [filter]);

	useEffect(() => {
		if (location.data) {
			if (isSuperAdmin(user?.role)) {
				setListLocation(location.data || []);
			} else {
				if (isOnlyAdmin(user?.role) || isUserRole(user?.role)) {
					const userBuildingIds = user?.buildings?.map((b) => b?.id) || [];
					const filteredLocations = location.data.filter((item) =>
						userBuildingIds.some((id) => id == item?.building?.id)
					);
					setListLocation(filteredLocations);
				} else {
					setListLocation([]);
				}
			}
		}
	}, [location.data, refresh]);

	const handleGetAllData = () => {
		let data = getAllCleaningPlan(filter);
		setDataTable(data);
	};

	const handleDelete = async () => {
		if (Array.isArray(selectedId)) {
			handleMultipleDelete();
		} else {
			handleSingleDelete();
		}
	};

	const handleSingleDelete = async () => {
		setOpenDelete(false);
	};

	const handleMultipleDelete = async () => {
		setOpenDelete(false);
	};

	const handleOpenDelete = (val) => {
		setOpenDelete(true);
		setSelectedId(val);
	};
	const handleOpenView = (val) => {
		setOpenView(true);
		setViewData(val);
	};

	const handleOpenEdit = (val) => {
		setOpenEdit(!openEdit);
		setEditData(val);
	};
	const onEdit = async (data) => {
		const payload = {
			name: data?.name,
			mapName: data?.mapName,
		};
		try {
			const res = await location.updateLocation(editData?.id, payload);

			if (res?.status === 200) {
				showToast("Location have been updated");
				setOpenEdit(false);
				location.fetchData();
			} else {
				showToast(res?.message || "Something wrong on server please try again");
			}
		} catch (err) {
			console.log("err", err);
			showToastError(
				err?.response?.data?.message ||
					"Something wrong on server please try again"
			);
		}
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

	const resetFilter = () => {
		setSubmitFilter({
			building: [],
			map: [],
		});
		setFilters({
			building: [],
			map: [],
		});
		setOpenModal(false);
		setIsReseted(!isReseted);
	};
	useEffect(() => {
		location.fetchData(watch("search"));
	}, [watch("search")]);

	useEffect(() => {
		location.fetchData(watch("search"), submitFilter);
	}, [submitFilter]);

	console.log("location", location);

	return (
		<>
			<DeleteModal
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				onDelete={() => handleDelete()}
				loading={loadingDelete}
			/>

			<ViewLocationModal
				viewItem={viewData}
				open={viewData}
				onClose={() => setViewData(!viewData)}
				setSelectedLocation={setSelectedLocation}
				setIsZoneManagement={setIsZoneManagement}
			/>
			<EditLocationModal
				editItem={editData}
				open={openEdit}
				onClose={() => setOpenEdit(false)}
				onEdit={(data) => onEdit(data)}
			/>
			<Page title={"Location"}>
				<div className="flex flex-col px2 md:px-5">
					<div className="w-full flex justify-between mb-3">
						<form onSubmit={handleSubmit(onSubmit)} className="flex space-x-3">
							<div className="w-[250px]">
								<SearchInput
									register={register}
									name="search"
									placeholder="Search Location"
									color={"text-white"}
								/>
							</div>
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
						</form>
					</div>
					<TableLocation
						data={listLocation || []}
						onView={(val) => handleOpenView(val)}
						onDelete={(val) => handleOpenDelete(val)}
						onBulkDelete={(val) => handleOpenDelete(val)}
						onEdit={(val) => handleOpenEdit(val)}
						handlePageChange={handlePageChange}
						query={query}
						setQuery={setQuery}
						handleSearch={handleSearch}
					/>
				</div>
			</Page>
		</>
	);
};

export default LocationView;
