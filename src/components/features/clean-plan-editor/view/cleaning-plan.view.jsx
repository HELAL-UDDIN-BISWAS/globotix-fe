"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import Button from "@/components/common/button";
import Page from "@/components/layout/page";
import DeleteModal from "@/components/modal/delete.modal";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { isAdmin } from "@/utils/helper";
import { v4 as uuid } from "uuid";
import TableCleaningPlan from "./cleaning-plan.table";
import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import FilterButton from "./FilterButton";
import { BiReset } from "react-icons/bi";
const socket = io(API_URL, { transport: ["websocket"] });

const CleaningPlanView = () => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [submitFilter, setSubmitFilter] = useState(null);
  const [isReseted, setIsReseted] = useState(false);
  const [filter, setFilter] = useState({
    building: [],
  });
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    keywords: "",
    pageSize: 10,
  });

  const { getCleaningPlan, plans, pageCount, deleteCleaningPlanEditor } =
    useCleaningPlanEditor();

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {};

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "cleaning-plan-editor") {
      getCleaningPlan(query);
    }
  });

  useEffect(() => {
    getCleaningPlan(query);
  }, [query]);

  useEffect(() => {
    getCleaningPlan(submitFilter);
  }, [submitFilter]);

  const handleSearch = (keywords) => {
    setQuery({ ...query, keywords: keywords });
  };

  const handlePageChange = (page) => {
    setQuery({ ...query, page: page });
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await deleteCleaningPlanEditor(selectedId);
      setLoadingDelete(false);
      if (response?.status === 200) {
        handleSearch("");
        setSelectedId(null);
        showToast("Cleaning have been deleted");
        setOpenDelete(false);
      } else {
      }
    } catch (error) {
      setLoadingDelete(false);
    }
  };

  const handleOpenDelete = (val) => {
    setOpenDelete(true);
    setSelectedId(val);
  };

  const handleView = (val) => {
    setOpenView(!openView);
    setViewItem(val);
  };
  const handleFilter = (val) => {
    setFilter({ ...filter, ...val });
  };
  const applyFilter = () => {
    setIsReseted(false);
    setSubmitFilter(filter);
  };
  const closeFilterModal = () => {
    setOpenModal(false);
    setIsReseted(false);
  };

  const resetFilter = () => {
    setSubmitFilter({
      building: [],
    });
    setFilter({
      building: [],
    });
    setOpenModal(false);
    setIsReseted(!isReseted);
  };

  return (
    <>
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => handleDelete()}
        loading={loadingDelete}
      />
      <Page title={"Cleaning Plan"}>
        <div className="flex flex-col px2 md:px-5">
          <div className="w-full flex justify-between mb-3">
            <div className="flex space-x-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  value={query?.keywords}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`bg-white relative w-full text-sm text-bodyTextColor border-none rounded-[10px] h-[45px] py-[12px] px-[15px] pr-[40px] focus:outline-none shadow-input-shadow`}
                  placeholder="Search Cleaning Plan"
                />
              </form>
              <div className="z-50" onClick={() => setOpenModal(!openModal)}>
                <FilterButton
                  handleFilter={handleFilter}
                  applyFilter={applyFilter}
                  resetFilter={resetFilter}
                  filter={filter}
                  isReseted={isReseted}
                  openModal={openModal}
                  toggle={() => closeFilterModal}
                />
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => resetFilter()}
              >
                <span className="text-hyperLinkColor border border-t-0 border-l-0 border-r-0 border-b-hyperLinkColor">
                  Reset
                </span>
                <BiReset fill="#599CFF" />
              </div>
            </div>
            {isAdmin(user?.role) && (
              <Link href="/cleaning-plan/add?mode=detail">
                <Button>
                  <span className="text-sm text-white">
                    + New Cleaning Plan
                  </span>
                </Button>
              </Link>
            )}
          </div>
          <TableCleaningPlan
            data={plans || []}
            onDelete={(val) => handleOpenDelete(val)}
            onBulkDelete={(val) => handleOpenDelete(val)}
            onView={(val) => handleView(val)}
            handlePageChange={handlePageChange}
            pageCount={pageCount}
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
        </div>
      </Page>
    </>
  );
};

export default CleaningPlanView;
