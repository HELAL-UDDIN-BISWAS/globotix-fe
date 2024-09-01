"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Page from "@/components/layout/page";
import useReports from "@/hooks/useReports";
import useRobotsList from "@/hooks/useRobotsList";

import FilterDuration from "../filter/filterDuration";

import ButtonDownloadReport from "./download.button";
import TableReports from "./reports.table";
import { FormProvider, useForm } from "react-hook-form";
import LoadingScreenPage from "../../accounts/view/loadingScreen";
import FilterButton from "./FilterButton";
import { BiReset } from "react-icons/bi";
import SearchInput from "@/components/form/searchinput";
import useAuth from "@/hooks/useAuth";
import { isOnlyAdmin, isSuperAdmin, isUserRole } from "@/utils/helper";

const ReportsView = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const robotId = searchParams.get("robot_id");
  const [dataChecklist, setDataChecklist] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageCount: 1,
    pageSize: 50,
    handlePageChange: (value) =>
      setPagination((prev) => ({ ...prev, page: value })),
  });

  const [listRobotId, setListRobotId] = useState([]);

  const [submitFilter, setSubmitFilter] = useState(
    robotId ? { robot_id: [robotId] } : null
  );
  const [openModal, setOpenModal] = useState(false);
  const [isReseted, setIsReseted] = useState(false);
  const [filters, setFilters] = useState(null);
  const reports = useReports();
  const robots = useRobotsList();
  const methods = useForm({
    defaultValues: {
      date_range: ["", ""],
      robot_id: "",
      cleaning_status: "",
    },
  });

  function customSort(a, b) {
    var numA = parseInt(a?.label.match(/\d+/) ? a?.label.match(/\d+/)[0] : "");
    var numB = parseInt(b?.label.match(/\d+/) ? b?.label.match(/\d+/)[0] : "");

    // Compare numeric parts
    if (numA !== numB) {
      return numA - numB;
    } else {
      var alphaA = a.label.replace(numA, "");
      var alphaB = b.label.replace(numB, "");
      return alphaA.localeCompare(alphaB);
    }
  }

  const fetchReport = useCallback(async () => {
    const searchInput = methods.watch("search");
    const [minDate, maxDate] = methods.watch("date_range");
    const dateFilter = {
      min_date: minDate,
      max_date: maxDate,
    };
    let filters = submitFilter || {};
    if (isOnlyAdmin(user?.role) || isUserRole(user?.role)) {
      filters.buildings = user?.buildings?.map((b) => b?.id) || [];
    }
    await reports.fetchData(searchInput, filters, dateFilter, pagination);
  }, [
    methods.watch("date_range"),
    methods.watch("search"),
    pagination.page,
    submitFilter,
  ]);

  useEffect(() => {
    fetchReport().catch();
  }, [fetchReport]);

  useEffect(() => {
    if (robots.data) {
      let _data = robots.data.map((v) => {
        return {
          ...v,
          id: v.id,
          name: "robot_id",
          label:
            v.attributes?.displayName !== "" ? v.attributes?.displayName : "",
          value: v.attributes?.baseName,
        };
      });

      _data.sort(customSort);

      setListRobotId(_data);
    }
  }, [robots.data]);

  useEffect(() => {
    if (pagination.pageCount < pagination.page) {
      setPagination((prev) => ({
        ...prev,
        page: prev.pageCount,
        pageCount: pagination.pageCount,
      }));
    } else {
      setPagination((prev) => ({
        ...prev,
        pageCount: pagination.pageCount,
      }));
    }
  }, [pagination.pageCount]);

  const toggleFilterModal = () => {
    setFilters([]);
    setOpenModal((prev) => !prev);
    if (!openModal) setIsReseted(false);
  };

  const handleFilter = (val) => {
    setFilters({ ...filters, ...val });
  };

  const applyFilter = () => {
    router.replace("/reports");
    setIsReseted(false);
    setSubmitFilter(filters);
    toggleFilterModal();
  };

  const resetFilterModal = () => {
    setSubmitFilter(null);
    setFilters(null);
    setIsReseted(!isReseted);
    toggleFilterModal();
  };

  const resetFilters = () => {
    methods.setValue("search", "");
    setSubmitFilter(null);
    setFilters(null);
    setIsReseted(!isReseted);
  };

  return (
    <Page
      title={"Reports"}
      header={<ButtonDownloadReport data={dataChecklist} />}
    >
      <div className="flex flex-col w-full">
        <div className="flex gap-[20px] items-center px-5">
          <FormProvider {...methods}>
            <div>
              <SearchInput
                register={methods.register}
                name="search"
                placeholder="Search by Building and Location"
                color={"text-white"}
              />
            </div>

            <FilterDuration expand={false} />
          </FormProvider>
          <FilterButton
            data-testid="filter-modal"
            handleFilter={handleFilter}
            applyFilter={applyFilter}
            resetFilter={resetFilterModal}
            filter={submitFilter}
            isReseted={isReseted}
            openModal={openModal}
            toggle={toggleFilterModal}
          />
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => resetFilters()}
          >
            <span className="text-hyperLinkColor border border-t-0 border-l-0 border-r-0 border-b-hyperLinkColor">
              Reset
            </span>
            <BiReset fill="#599CFF" />
          </div>
        </div>
      </div>
      {reports?.loading ? (
        <LoadingScreenPage />
      ) : (
        <div className="px-5 mt-5 pb-10 w-full overflow-auto">
          <TableReports
            listRobot={listRobotId}
            data={reports.data || []}
            setDataChecklist={(data) => setDataChecklist(data)}
            dataChecklist={dataChecklist}
            pagination={pagination}
          />
        </div>
      )}
    </Page>
  );
};

export default ReportsView;
