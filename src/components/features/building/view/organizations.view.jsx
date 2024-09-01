"use client";
import { useEffect, useState } from "react";
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
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";

import TableBuilding from "./building.table";
import ViewBuildingDetail from "./ViewBuildingDetail";
import axios from "axios";
import useOrganization from "@/hooks/useOrganization";
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
  const building = useBuilding();
  const [filters, setFilters] = useState();
  const [isReseted, setIsReseted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitFilter, setSubmitFilter] = useState(null);
  const organization = useOrganization();
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
    building.fetchData();
  }, []);
  useEffect(() => {
    building.fetchData(watch("search"), status);
  }, [watch("search")]);

  useEffect(() => {
    building.fetchData(watch("search"), status);
  }, [status]);

  const [filter, setFilter] = useState({});

  useEffect(() => {
    if (isSuperAdmin(user?.role)) {
      setListBuilding(building?.data);
    } else if (isOnlyAdmin(user?.role)) {
      if (building?.data?.length > 0) {
        let arr = [...building?.data];

        // arr = arr.filter(
        //   (item) => item?.organization?.id == user?.organization?.id
        // );

        // setListBuilding([...arr]);
        // console.log("arr", arr);

        const userOrganizationId = user?.organization?.id;
        const userBuildingIds = user?.buildings?.map((b) => b?.id) || [];
        arr = building?.data?.filter(
          (item) =>
            item?.organization?.id == userOrganizationId &&
            userBuildingIds.some((id) => id == item?.id)
        );

        setListBuilding(arr);
      } else {
        setListBuilding(building.data);
      }
    } else {
      if (user.role == "user") {
        if (building?.data?.length > 0) {
          let arr = [...building?.data];

          const userOrganizationId = user?.organization?.id;
          const userBuildingIds = user?.buildings?.map((b) => b?.id) || [];
          arr = building?.data?.filter(
            (item) =>
              item?.organization?.id == userOrganizationId &&
              userBuildingIds.some((id) => id == item?.id)
          );

          setListBuilding(arr);
        } else {
          setListBuilding(building.data);
        }
      }
    }
  }, [building.data, submitFilter]);
  // const handleDelete = async () => {
  //   if (Array.isArray(selectedId)) {
  //     handleMultipleDelete();
  //   } else {
  //     handleSingleDelete();
  //   }
  // };

  // const handleSingleDelete = async () => {
  //   setLoadingDelete(true);
  //   try {
  //     const response = await api.delete(`/building/${selectedId}`);
  //     setLoadingDelete(false);
  //     if (response?.status === 200) {
  //       building.fetchData(watch("search"), status);
  //       setSelectedId(null);
  //       showToast("Building have been deleted");
  //       setOpenDelete(false);
  //     } else {
  //     }
  //   } catch (error) {
  //     setLoadingDelete(false);
  //   }
  // };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/buildings/bulk-delete`,
        {
          buildingIds: selectedId,
        }
      );
      setLoadingDelete(false);
      if (response?.status === 200) {
        building.fetchData(watch("search"), status);
        setSelectedId(null);
        showToast("Building have been deleted");
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
  useEffect(() => {
    building.fetchData(watch("search"), status, submitFilter);
  }, [submitFilter]);

  const handleFilter = (val) => {
    setFilters({ ...filters, ...val });
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
                onClick={() => resetFilter()}
              >
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
                  <span className="text-sm text-white">+ Organization</span>
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
