"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import Button from "@/components/common/button";
import SearchInput from "@/components/form/searchinput";
import Page from "@/components/layout/page";
import DeleteModal from "@/components/modal/delete.modal";
import ROBOT from "@/const/robot";
import useAuth from "@/hooks/useAuth";
import useRobotsList from "@/hooks/useRobotsList";
import { useToast } from "@/hooks/useToast";
import { getAllModuleRobot } from "../mocks/module_robot.data";
import { v4 as uuid } from "uuid";
import TableRobotBase from "./baseRobot.table";
import TableRobotModule from "./moduleRobot.table";
import { isOnlyAdmin, isSuperAdmin, isUserRole } from "@/utils/helper";
import apolloClient from "@/lib/apolloClient";
import { DELETE_ROBOT } from "@/graphql/mutation/robot";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import FilterButton from "./FilterButton";
import { BiReset } from "react-icons/bi";
const socket = io(API_URL, { transport: ["websocket"] });

const RobotsView = () => {
	const [openDelete, setOpenDelete] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {};

	const [type, setType] = useState(ROBOT.BASE);
	const [dataRobotbase, setDataRobotbase] = useState([]);
	const [dataRobotModule, setDataRobotModule] = useState([]);
	const [filter, setFilter] = useState({});
	const [filters, setFilters] = useState();
	const [isReseted, setIsReseted] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [submitFilter, setSubmitFilter] = useState(null);
	const [assignedBuildings, setAssignedBuildings] = useState(null);
	const { user } = useAuth();
	const robots = useRobotsList();

	const { showToast } = useToast();

	socket.on("robot-flexadev-queue", (arg) => {
		if (arg.table_name === "robot") {
			robots.fetchData(watch("search"), watch("searchBN"));
		}
	});

	useEffect(() => {
		if (isOnlyAdmin(user?.role) || isUserRole(user?.role)) {
			const userBuildings = user?.buildings?.map((b) => b?.id) || [];
			setAssignedBuildings(userBuildings);
		}
	}, [user]);

	useEffect(() => {
		const fetchRobots = async () => {
			await robots.fetchData(
				watch("search"),
				watch("searchBN"),
				submitFilter,
				assignedBuildings
			);
		};
		fetchRobots();
	}, [watch("search"), watch("searchBN"), submitFilter, assignedBuildings]);

	useEffect(() => {
		if (robots.data) {
			setDataRobotbase(robots.data || []);
		}
	}, [robots.data]);

	const handleGetAllData = () => {
		let dataRobotModule = getAllModuleRobot(filter);
		setDataRobotModule(dataRobotModule);
	};

	const handleDelete = async () => {
		if (Array.isArray(selectedId)) {
			handleMultipleDelete();
		} else {
			handleSingleDelete();
		}
	};

	const handleSingleDelete = async () => {
		setLoadingDelete(true);
		try {
			const { data } = await apolloClient.mutate({
				mutation: DELETE_ROBOT,
				variables: {
					id: selectedId,
				},
			});
			setLoadingDelete(false);

			if (data?.deleteRobot?.data?.id) {
				robots.fetchData();
				setSelectedId(null);
				showToast("Robot have been deleted");
				setOpenDelete(false);
			}
		} catch (error) {
			setLoadingDelete(false);
		}
	};

	const handleMultipleDelete = async () => {
		setLoadingDelete(true);
		try {
			await Promise.all(
				selectedId?.map(async (id) => {
					await apolloClient.mutate({
						mutation: DELETE_ROBOT,
						variables: {
							id: id,
						},
					});
				})
			);

			await robots.fetchData(watch("search"), watch("searchBN"));
			setLoadingDelete(false);
			setSelectedId(null);
			showToast("Robots have been deleted");
			setOpenDelete(false);
		} catch (error) {
			setLoadingDelete(false);
		}
	};
	useEffect(() => {
		robots.fetchData("", "", submitFilter);
	}, [submitFilter]);

	const handleFilter = (val) => {
		setFilters({ ...filters, ...val });
	};
	const handleOpenDelete = (val) => {
		setOpenDelete(true);
		setSelectedId(val);
	};
	const resetFilter = () => {
		setSubmitFilter([]);
		setFilters([]);
		setOpenModal(false);
		setIsReseted(!isReseted);
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
			<Page title={"Bots"}>
				<div className="flex flex-col px2 md:px-5">
					<div className="w-full flex justify-between mb-3">
						<div className="flex">
							<form
								className="flex space-x-2"
								onSubmit={handleSubmit(onSubmit)}>
								<SearchInput
									register={register}
									name="search"
									placeholder="Search Robot Display Name"
									isInvalid={errors.search}
									color={"text-white"}
								/>

								{/* <SearchInput
                  register={register}
                  name="searchBN"
                  placeholder="Search by Base Name"
                  isInvalid={errors.search}
                  color={"text-white"}
                /> */}
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

							<div className="ml-4 flex h-[45px] item-center space-x-2.5">
								{/* <ButtonOptionTab
                  onClick={() => setType(ROBOT.BASE)}
                  active={type === ROBOT.BASE}
                  text="Base"
                /> */}
								{/*<ButtonOptionTab
                  onClick={() => setType(ROBOT.MODULE)}
                  active={type === ROBOT.MODULE}
                  text="Module"
                />*/}
							</div>
						</div>
						{/* {isOnlyAdmin(user?.role) && (
							<Link
								href={`/robots/${type === ROBOT.BASE ? "base" : "module"}/add`}>
								<Button>
									<span className="text-sm text-white">+ Add Bot</span>
								</Button>
							</Link>
						)} */}
					</div>
					{type === ROBOT.BASE && (
						<TableRobotBase
							data={dataRobotbase || []}
							onDelete={(val) => handleOpenDelete(val)}
							onBulkDelete={(val) => handleOpenDelete(val)}
							fetchData={async () => {
								await robots.fetchData(watch("search"), watch("searchBN"));
							}}
						/>
					)}
					{type === ROBOT.MODULE && (
						<TableRobotModule
							data={dataRobotModule || []}
							onDelete={(val) => handleOpenDelete(val)}
							onBulkDelete={(val) => handleOpenDelete(val)}
						/>
					)}
				</div>
			</Page>
		</>
	);
};

export default RobotsView;
