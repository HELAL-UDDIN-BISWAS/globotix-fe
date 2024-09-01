"use client";

import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import Page from "@/components/layout/page";
import DiscardModal from "@/components/modal/discard-confirm.modal";
import SuccessModal from "@/components/modal/success.modal";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "@/components/form/text.input";
import SelectInput from "@/components/form/select.input";
import DateInput from "@/components/form/date.input";
import CleaningPlanTable from "./cleaning-plan-table-modal";
import { plan } from "./plan";
import TimeInput from "@/components/form/time.input";
import useSchedule from "@/hooks/useSchedule";
import moment from "moment";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import dayjs from "dayjs";
const socket = io(API_URL, { transport: ["websocket"] });

const ScheduleAddView = () => {
  const { showToast, showToastError } = useToast();
  const router = useRouter();
  const searchParam = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [choosePlanId, setChoosePlanId] = useState(null);
  const [repeatDisplay, setRepeatDisplay] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [weekDaysDisplay, setWeekDaysDisplay] = useState(false);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Schedule Name is required"),
    frequency: Yup.object().required("Frequency is required"),
    repeat: repeatDisplay
      ? Yup.string().required("Repeat Until is required")
      : "",
    weekDays: weekDaysDisplay
      ? Yup.array()
          .min(1, "Please select at least one day of the week")
          .required("Days of the week are required")
      : "",
    cleaningDate: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .required("Cleaning Date is required"),
    cleaningTime: Yup.string().required("Cleaning Time is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { createSchedule, getCleaningPlan, plan, pageCount } = useSchedule();
  console.log("plan", plan);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm(formOptions);
  const [query, setQuery] = useState({
    page: 1,
    keywords: "",
    pageSize: 10,
  });
  const formatTimeString = (timeString) => {
    const momentObj = moment(timeString, [
      "HH:mm:ss.SSS",
      "HH:mm:ss",
      "HH:mm",
      "HH",
    ]);
    return momentObj.isValid()
      ? momentObj.format("HH:mm:ss.SSS")
      : "Invalid time format";
  };

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "cleaning-plan-editor") {
      getCleaningPlan(query);
    }
  });

  const checkSession = () => {
    const storedData = sessionStorage.getItem("scheduleFormData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      setChoosePlanId(parsedData?.planId);
      reset(parsedData);
    }
  };

  useEffect(() => {
    if (searchParam.get("from") == "plan-create") {
      checkSession();
    }
  }, []);

  useEffect(() => {
    getCleaningPlan(query);
  }, [query]);

  useEffect(() => {
    if (watch("frequency")?.value !== "Once") {
      setRepeatDisplay(true);
    } else {
      setRepeatDisplay(false);
    }
    if (watch("frequency")?.value === "Weekly") {
      setRepeatDisplay(true);
      setWeekDaysDisplay(true);
    } else {
      setWeekDaysDisplay(false);
    }
  }, [watch("frequency")]);

  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);
    const payload = {
      name: data?.name || "",
      scheduleType: data?.scheduleType?.value?.split(" ").join("_") || "",
      frequency: data?.frequency?.value || "",
      cleaningTime: formatTimeString(data?.cleaningTime) || "",
      cleaningDate: dayjs(data?.cleaningDate).format("YYYY-MM-DD") || "",
      cleaningPlanEditor: choosePlanId || null,
      repeatUntil: data?.repeat || null,
      location: planInfo?.locationId || null,
      zones: planInfo?.zones?.map((zone) => zone?.id),
      daysOfWeek:
        JSON.stringify(data?.weekDays?.map((day) => day?.value)) || null,
      createdByUser: user?.id,
      modifiedByUser: user?.id,
    };

    try {
      const response = await createSchedule({
        payload: payload,
      });

      if (response?.status === 200) {
        setLoading(false);
        setSuccessOpen(!successOpen);
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

  const handleSearch = (keywords) => {
    setQuery({ ...query, keywords: keywords });
  };
  const handleAddPlan = (plan) => {
    setValue("cleaningPlan", plan?.name);
    setChoosePlanId(plan?.id);
    setPlanInfo(plan);
    setOpenTable(!openTable);
  };

  const handlePageChange = (page) => {
    setQuery({ ...query, page: page });
  };

  return (
    <>
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onBack={() => router?.push("/schedule")}
        text={"View All Schedules"}
        successText={"New Schedule Added"}
      />
      <DiscardModal
        open={openDiscard}
        onClose={() => setOpenDiscard(false)}
        onBack={() => router?.back()}
      />
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => router?.back()}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              Add Schedule
            </span>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black"
        >
          <div className="w-full ">
            <div className="bg-white rounded-[10px] p-2 md:p-5 space-y-8">
              <div className="space-y-5">
                <div className="text-primary font-semibold">
                  Schedule Details
                </div>
                <div className="grid grid-cols-1 gap-5 w-full">
                  <TextInput
                    label="Cleaning Plan"
                    register={register}
                    name="cleaningPlan"
                    readOnly={true}
                    placeholder="Select Cleaning Plan"
                    isInvalid={errors.cleaningPlane}
                    onClick={() => setOpenTable(!openTable)}
                  />
                  <CleaningPlanTable
                    data={plan}
                    open={openTable}
                    onClose={() => setOpenTable(!openTable)}
                    setPlanName={(val) => handleAddPlan(val)}
                    handlePageChange={handlePageChange}
                    pageCount={pageCount}
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                    choosePlanId={choosePlanId}
                    getValues={getValues}
                  />
                  <TextInput
                    label="Schedule Name"
                    register={register}
                    name="name"
                    placeholder="Schedule Name"
                    isInvalid={errors.name}
                  />
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
                  <DateInput
                    label="Cleaning Date"
                    register={register}
                    name="cleaningDate"
                    placeholder=""
                    isInvalid={errors.cleaningDate}
                  />
                  <TimeInput
                    label="Cleaning Time"
                    register={register}
                    name="cleaningTime"
                    placeholder=""
                    isInvalid={errors.cleaningTime}
                  />
                  <SelectInput
                    label="Schedule Type"
                    register={register}
                    name="scheduleType"
                    placeholder="Select Schedule Type"
                    control={control}
                    options={[
                      { value: "Auto Docking", label: "Auto Docking" },
                      { value: "Manual Docking", label: "Manual Docking" },
                    ]}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                  />
                  <div className="z-30">
                    <SelectInput
                      label="Frequency"
                      name="frequency"
                      placeholder="Select Frequency"
                      control={control}
                      options={[
                        { value: "Once", label: "Once" },
                        { value: "Daily", label: "Daily" },
                        { value: "Weekly", label: "Weekly" },
                      ]}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      isInvalid={errors.frequency}
                    />
                  </div>
                  {repeatDisplay && (
                    <DateInput
                      label="Repeat Until"
                      register={register}
                      name="repeat"
                      placeholder=""
                      isInvalid={errors.repeat}
                    />
                  )}
                  {weekDaysDisplay && (
                    <SelectInput
                      isMulti={true}
                      label="Days of the week"
                      register={register}
                      name="weekDays"
                      placeholder="Select days"
                      control={control}
                      options={[
                        { value: "1", label: "Monday" },
                        { value: "2", label: "Tuesday" },
                        { value: "3", label: "Wednesday" },
                        { value: "4", label: "Thursday" },
                        { value: "5", label: "Friday" },
                        { value: "6", label: "Saturday" },
                        { value: "7", label: "Sunday" },
                      ]}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      isInvalid={errors.weekDays}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-5 mt-5 mb-24">
              <SecondaryButton
                onClick={() => setOpenDiscard(!openDiscard)}
                type="button"
                className={`w-max font-semibold flex items-center bg-primary02 border border-primary justify-center py-4 px-5 h-[45px] rounded-[10px]  `}
              >
                <div className="flex space-x-2 w-max justify-center items-center text-primary">
                  Cancel
                </div>
              </SecondaryButton>
              <Button
                loading={loading}
                type="submit"
                formNoValidate="formnovalidate"
              >
                <span className="text-sm text-white">Add Schedule</span>
              </Button>
            </div>
          </div>
        </form>
      </Page>
    </>
  );
};

export default ScheduleAddView;
