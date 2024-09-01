"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import NumberInput from "@/components/form/number.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import Page from "@/components/layout/page";
import useBuilding from "@/hooks/useBuilding";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { yupResolver } from "@hookform/resolvers/yup";

import PreventiveMaintenanceTarget from "../preventiveMaintenanceTarget";
import SecondaryButton from "@/components/button/SecondaryButton";
import useAuth from "@/hooks/useAuth";
import useRobots from "@/hooks/useRobots";
import useLocation from "@/hooks/useLocation";
import useCleaningPlan from "@/hooks/useCleaningPlan";
import useAccount from "@/hooks/useAccount";
import useZone from "@/hooks/useZone";
import { FaChevronLeft } from "react-icons/fa";
import { GET_CLEANING_PLANS } from "@/graphql/queries/cleaningPlan";
import apolloClient from "@/lib/apolloClient";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
const socket = io(API_URL, { transport: ["websocket"] });

const fetchCleaningPlans = async (locationId) => {
  let response = await apolloClient.query({
    query: GET_CLEANING_PLANS,
    fetchPolicy: "network-only",
    variables: {
      filters: {
        location: { id: { eq: locationId } },
      },
    },
  });
  if (response?.data?.cleaningPlanEditors?.data) {
    return response?.data?.cleaningPlanEditors?.data;
  } else {
    return [];
  }
};

const RobotBaseAddView = () => {
  const { showToast, showToastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [openPMTarget, setOpenPMTarget] = useState(false);
  const router = useRouter();
  const building = useBuilding();
  const location = useLocation();
  const cleaningPlan = useCleaningPlan();
  const account = useAccount();
  const zone = useZone();
  const { createRobot } = useRobots();
  const { user } = useAuth();
  const [listBuilding, setListBuilding] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [listCleaningPlan, setListCleaningPlan] = useState([]);
  const [listAccount, setListAccount] = useState([]);
  const [listZone, setListZone] = useState([]);

  const validationSchema = Yup.object().shape({
    // building_name: Yup.object().required("Building Name is required"),
    // location_name: Yup.string().required("Location Name is required"),
    // cleaning_plan: Yup.string().required("Cleaning Plan is required"),
    base_name: Yup.string().required("Robot Name is required"),
    display_name: Yup.string().required("Display Name is required"),
    serial_number: Yup.string().required("Serial Number is required"),
    // wireguard_ip: Yup.string().required("Wireguard IP is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm(formOptions);

  useEffect(() => {
    setValue("working_status", { value: "Offline", label: "Offline" });
    setValue("status_level", 0);
    setValue("battery_percentage", 0);
    setValue("gutter_brush_usage", 0);
    setValue("cleaning_time", 0);
    setValue("deployed_time", 0);
  }, []);

  useEffect(() => {
    if (building?.data?.length > 0) {
      let arr = building?.data.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item?.name,
        };
      });
      setListBuilding(arr);
    }
  }, [building?.data]);

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "location") {
      const selectedBuilding = watch("building_name");
      if (selectedBuilding) location.fetchData("", selectedBuilding?.id);
    }
  });

  useEffect(() => {
    const selectedBuilding = watch("building_name");
    if (selectedBuilding) location.fetchData("", selectedBuilding?.id);
  }, [watch("building_name")]);

  const setCleaningPlanOptions = async (selectedLocation) => {
    if (selectedLocation) {
      setListCleaningPlan([]);
      if (Array.isArray(selectedLocation)) {
        selectedLocation?.map(async (item) => {
          const res = await fetchCleaningPlans(item?.value);
          const options = res?.map((plan) => ({
            ...plan?.attributes,
            value: plan?.id,
            label: plan?.attributes?.name,
          }));
          setListCleaningPlan((prev) => [...prev, ...options]);
        });
      } else {
        const res = await fetchCleaningPlans(selectedLocation?.value);
        const options = res?.map((plan) => ({
          ...plan?.attributes,
          value: plan?.id,
          label: plan?.attributes?.name,
        }));
        setListCleaningPlan(options);
      }
    } else {
      setListCleaningPlan([]);
    }
  };

  useEffect(() => {
    const selectedLocation = watch("location_name");
    setCleaningPlanOptions(selectedLocation);
  }, [watch("location_name")]);

  useEffect(() => {
    if (location?.data?.length > 0) {
      let arr = location?.data.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item?.name,
        };
      });
      setListLocations(arr);
    } else {
      setListLocations([]);
      setValue("location_name", null);
    }
  }, [location?.data]);

  // useEffect(() => {
  //   if (cleaningPlan?.data?.length > 0) {
  //     let arr = cleaningPlan?.data.map((item) => {
  //       return {
  //         ...item?.attributes,
  //         value: item.id,
  //         label: item?.attributes?.name,
  //       };
  //     });
  //     setListCleaningPlan(arr);
  //   } else {
  //     setListCleaningPlan([]);
  //   }
  // }, [cleaningPlan?.data]);

  useEffect(() => {
    if (account?.data?.length > 0) {
      let arr = account?.data.map((item) => {
        return {
          ...item?.attributes,
          value: item.id,
          label: item?.attributes?.username,
        };
      });
      setListAccount(arr);
    } else {
      setListAccount([]);
    }
  }, [account?.data]);

  // useEffect(() => {
  //   if (zone?.data?.length > 0) {
  //     let arr = zone?.data.map((item) => {
  //       return {
  //         ...item?.attributes,
  //         value: item.id,
  //         label: item?.attributes?.name,
  //       };
  //     });
  //     setListZone(arr);
  //   } else {
  //     setListZone([]);
  //   }
  // }, [zone?.data]);

  // useEffect(() => {
  //   if (listLocations.length > 0) {
  //     setValue("location_name", listLocations[0]);
  //   } else {
  //     setValue("location_name", null);
  //   }
  // }, [listLocations]);

  useEffect(() => {
    if (listCleaningPlan.length > 0) {
      setValue("cleaning_plan", listCleaningPlan);
    } else {
      setValue("cleaning_plan", []);
    }
  }, [listCleaningPlan]);

  useEffect(() => {
    if (listBuilding.length > 0) {
      setValue("building_name", listBuilding[0]);
    }
  }, [listBuilding]);

  const submit = async (data) => {
    if (loading) return;

    setLoading(true);

    const location = Array.isArray(data?.location_name)
      ? data?.location_name?.map((location) => location?.value)
      : data?.location_name?.value
        ? [data?.location_name?.value]
        : [];

    const cleaningPlan = Array.isArray(data?.cleaning_plan)
      ? data?.cleaning_plan?.map((location) => location?.value)
      : [data?.cleaning_plan?.value];

    const payload = {
      baseName: data.base_name,
      displayName: data.display_name,
      // wireguardIp: data.wireguard_ip,
      // license: data.license,
      serialNumber: data.serial_number,
      // firmwareVersion: data.firmware_ver,
      building: data.building_name.value,
      locations: location,
      cleaningPlanEditors: cleaningPlan,
      createdByUser: user?.id,
      modifiedByUser: user?.id,
      // workingStatus: data.working_status.value,
      // statusLevel: data.status_level.value,
      // batteryPercentage: parseFloat(data.battery_percentage),
      // gutterBrushUsage: parseFloat(data.gutter_brush_usage),
      // addedByUser: data.account.value,
      // chargingTime: parseFloat(data.charging_time),
      // deployedTime: parseFloat(data.deployed_time),
      // status: data.status.value,
    };
    console.log("payload", payload);

    try {
      const response = await createRobot({ payload: payload });

      if (response?.status === 200) {
        setTimeout(() => {
          setLoading(false);
          showToast("A new base has been created");
          router.push("/robots");
        }, 2000);
      } else {
        setLoading(false);
        showToastError("Base Error");
      }
    } catch (error) {
      setLoading(false);
      showToastError(
        error?.response?.data?.msg ||
          error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  return (
    <>
      <PreventiveMaintenanceTarget
        open={openPMTarget}
        onClose={() => setOpenPMTarget(false)}
      />
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="primary"
              className="cursor-pointer"
              onClick={() => router?.push("/robots")}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              New Robot
            </span>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(submit)}
          className="space-x-5 px-5 flex flex-col gap-[10px] w-full text-black"
        >
          <div className="bg-white rounded-[10px]">
            <div className="p-2 md:p-5 md:pb-0">
              {/* <label className="text-primary font-semibold">
                  General Information
                </label> */}
              <div className="w-full grid grind-cols-1 md:grid-cols-2 gap-5 mt-4">
                <SelectInput
                  label="Building Name"
                  register={register}
                  name="building_name"
                  placeholder="Choose Building Name"
                  isInvalid={errors.building_name}
                  control={control}
                  options={listBuilding}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
                <SelectInput
                  label="Location Name"
                  register={register}
                  name="location_name"
                  placeholder="Choose Location Name"
                  disabled={!watch("building_name")}
                  isInvalid={errors.location_name}
                  control={control}
                  options={listLocations}
                  isMulti
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
              </div>
              <div className="w-full mt-4">
                <SelectInput
                  label="Cleaning Plan"
                  register={register}
                  name="cleaning_plan"
                  placeholder="Choose Cleaning Plan"
                  isInvalid={errors.cleaning_plan}
                  disabled={
                    !watch("location_name") ||
                    watch("location_name")?.length == 0
                  }
                  isMulti
                  control={control}
                  options={listCleaningPlan}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
              </div>
            </div>
            <div className="p-2 md:p-5 md:pb-0">
              <label className="text-primary text-lg font-semibold">
                Specification
              </label>
              <div className="w-full grid grind-cols-1 md:grid-cols-2 gap-5 mt-4">
                <TextInput
                  label="Base Name"
                  register={register}
                  name="base_name"
                  placeholder="Type Base Name"
                  isInvalid={errors.base_name}
                  isRequired
                />

                <TextInput
                  label="Display Name"
                  register={register}
                  name="display_name"
                  placeholder="Type Display Name"
                  isInvalid={errors.display_name}
                  isRequired
                />

                <TextInput
                  label="Serial Number"
                  register={register}
                  name="serial_number"
                  placeholder="Type Serial Number"
                  isInvalid={errors.serial_number}
                  isRequired
                />

                {/* <TextInput
                  label="Wireguard IP"
                  register={register}
                  name="wireguard_ip"
                  placeholder="Type Wireguard IP"
                  isInvalid={errors.wireguard_ip}
                  isRequired
                /> */}

                {/* <TextInput
                  label="License"
                  register={register}
                  name="license"
                  placeholder="Type License"
                  isInvalid={errors.license}
                  isRequired
                />

                <TextInput
                  label="Firmware Version"
                  register={register}
                  name="firmware_ver"
                  placeholder="Type Firmware Version"
                  isInvalid={errors.firmware_ver}
                  isRequired
                /> */}

                {/* <SelectInput
                  label="Account"
                  register={register}
                  name="account"
                  placeholder="Select Account"
                  isInvalid={errors.account}
                  control={control}
                  options={listAccount}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                /> */}
              </div>
            </div>
            {/* <div className="p-2 md:p-5">
              <label className="text-lg text-primary font-semibold">
                Status
              </label>
              <div className="w-full grid grind-cols-1 md:grid-cols-2 gap-5 mt-4">
                <SelectInput
                  label="Working Status"
                  register={register}
                  name="working_status"
                  placeholder="Choose Working Status"
                  isInvalid={errors.working_status}
                  control={control}
                  options={[
                    { value: "Online", label: "Online" },
                    { value: "Offline", label: "Offline" },
                    // { value: "idle", label: "Idle" },
                    // { value: "cleaning", label: "Cleaning" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />

                <SelectInput
                  label="Status Level"
                  register={register}
                  name="status_level"
                  placeholder="Select Status"
                  isInvalid={errors.status_level}
                  control={control}
                  options={[
                    { value: "Offline", label: "OFFLINE" },
                    { value: "Critical", label: "CRITICAL" },
                    { value: "Warning", label: "WARNING" },
                    { value: "Good", label: "GOOD" },
                    { value: "Idle", label: "IDLE" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />

                <NumberInput
                  label="Battery Percentage"
                  register={register}
                  name="battery_percentage"
                  sufix="%"
                  isInvalid={errors.battery_percentage}
                  isRequired
                />

                <NumberInput
                  label="Gutter Brush Usage"
                  register={register}
                  name="gutter_brush_usage"
                  sufix="%"
                  isInvalid={errors.gutter_brush_usage}
                  isRequired
                />

                <NumberInput
                  label="Charging Time"
                  register={register}
                  name="charging_time"
                  isInvalid={errors.charging_time}
                  isRequired
                />

                <NumberInput
                  label="Deployed Time"
                  register={register}
                  name="deployed_time"
                  isInvalid={errors.deployed_time}
                  isRequired
                />

                <SelectInput
                  label="Robot Status"
                  register={register}
                  name="robot_status"
                  placeholder="Select Status"
                  isInvalid={errors.robot_status}
                  control={control}
                  options={[
                    { value: "Cleaning", label: "Cleaning" },
                    { value: "Idle", label: "Idle" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />

                <SelectInput
                  label="Zone Position"
                  register={register}
                  name="account"
                  placeholder="Select Account"
                  isInvalid={errors.account}
                  disabled={
                    watch("robot_status")?.value !== "Cleaning" ||
                    !watch("location_name")
                      ? true
                      : false
                  }
                  control={control}
                  options={listZone}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
              </div>
            </div> */}

            <div className="flex gap-5 p-2 md:p-5">
              <SecondaryButton
                onClick={
                  !loading
                    ? () => {
                        router.push("/robots");
                      }
                    : () => {}
                }
                type="button"
              >
                Cancel
              </SecondaryButton>

              <Button
                loading={loading}
                formNoValidate="formnovalidate"
                type="submit"
              >
                <span className="text-sm text-white">Create Robot</span>
              </Button>
            </div>
          </div>
        </form>
      </Page>
    </>
  );
};

export default RobotBaseAddView;
