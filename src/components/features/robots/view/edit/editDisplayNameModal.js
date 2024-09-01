import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import NumberInput from "@/components/form/number.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import useBuilding from "@/hooks/useBuilding";
import useCleaningPlan from "@/hooks/useCleaningPlan";
import useLocation from "@/hooks/useLocation";
import useRobots from "@/hooks/useRobots";
import useRobotsList from "@/hooks/useRobotsList";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
const socket = io(API_URL, { transport: ["websocket"] });

const EditDisplayNameModal = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { showToast, showToastError } = useToast();
  const user = useAuth();
  const router = useRouter();
  const building = useBuilding();
  const location = useLocation();
  const cleaningPlan = useCleaningPlan();
  const { updateRobot } = useRobots();
  const robots = useRobotsList();
  const [listBuilding, setListBuilding] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [listCleaningPlan, setListCleaningPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    if (props.open === true && props.selectedItem) {
      const data = {
        ...props.selectedItem?.attributes,
        id: props.selectedItem?.id,
      };

      reset({
        id: data?.id,
        display_name: data?.displayName,
        building_name: {
          value: data?.building?.data?.id,
          label: data?.building?.data?.attributes?.name,
        },
        // location_name: {
        //   value: data?.location?.data?.id,
        //   label: data?.location?.data?.attributes?.name,
        // },
        location_name: data?.locations?.data?.map((location) => ({
          value: location?.id,
          label: location?.attributes?.name,
        })),
        cleaning_plan: data?.cleaningPlanEditors?.data?.map((plan) => ({
          value: plan?.id,
          label: plan?.attributes?.name,
        })),
        display_name: data?.displayName,
        serial_number: data?.serialNumber,
        // wireguard_ip: data?.wireguardIp,
        // license: data?.license,
        // firmware_ver: data?.firmwareVersion,
        // working_status: {
        //   value: data?.workingStatus,
        //   label: data?.workingStatus,
        // },
        // status_level: data?.statusLevel,
        // battery_percentage: data?.batteryPercentage,
        // gutter_brush_usage: data?.gutterBrushUsage,
        // charging_time: data?.chargingTime,
        // deployed_time: data?.deployedTime,
      });
    }
  }, [props.open]);

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

  useEffect(() => {
    if (building?.data?.length > 0) {
      let arr = building?.data.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setListBuilding(arr);
    }
  }, [building?.data]);

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
    }
  }, [location?.data]);

  useEffect(() => {
    if (cleaningPlan?.data?.length > 0) {
      let arr = cleaningPlan?.data.map((item) => {
        return {
          ...item?.attributes,
          value: item.id,
          label: item?.attributes?.name,
        };
      });
      setListCleaningPlan(arr);
    } else {
      setListCleaningPlan([]);
    }
  }, [cleaningPlan?.data]);

  const handleClose = () => {
    props.onClose();
  };

  const submit = async (data) => {
    const location = Array.isArray(data?.location_name)
      ? data?.location_name?.map((location) => location?.value)
      : [data?.location_name?.value];

    const cleaningPlan = Array.isArray(data?.cleaning_plan)
      ? data?.cleaning_plan?.map((location) => location?.value)
      : [data?.cleaning_plan?.value];

    const payload = {
      building: data.building_name?.value,
      locations: location,
      cleaningPlanEditors: cleaningPlan,
      displayName: data.display_name,
      serialNumber: data.serial_number,
      modifiedByUser: user?.id,
      // wireguardIp: data.wireguard_ip,
      // license: data.license,
      // firmwareVersion: data.firmware_ver,
      // workingStatus: data.working_status.value,
      // statusLevel: parseFloat(data.status_level),
      // batteryPercentage: parseFloat(data.battery_percentage),
      // gutterBrushUsage: parseFloat(data.gutter_brush_usage),
      // chargingTime: parseFloat(data.charging_time),
      // deployedTime: parseFloat(data.deployed_time),
    };

    try {
      const response = await updateRobot({ id: data.id, payload: payload });

      if (response?.status === 200) {
        setTimeout(() => {
          // setLoading(false);
          showToast("A new base has been updated");
          router.push("/robots");
        }, 2000);
        await props.fetchData();
        props.onClose();
      } else {
        // setLoading(false);
        showToastError("Base Error");
      }
    } catch (error) {
      // setLoading(false);
      showToastError(
        error?.response?.data?.msg ||
          error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  return (
    <>
      {props.open && (
        <div
          onClick={() => handleClose()}
          className="bg-black fixed w-full h-screen top-0 left-0 z-[997] opacity-40 transition-all"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[998] ${
          props.open ? "bottom-1/2 translate-y-1/2" : "-bottom-[1000px]"
        } left-1/2 -translate-x-1/2 py-[20px] px-[20px] border-none rounded-[20px] w-[90%] md:w- h-max bg-white text-black-1`}
      >
        <div className="text-xl font-semibold text-titleFontColor mb-5 flex gap-[5px] items-center justify-between">
          <span>Edit Robot Details</span>
          <IoCloseOutline
            onClick={props.onClose}
            size={24}
            className="cursor-pointer"
          />
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <div className="h-[500px] overflow-y-scroll">
            <div className="p-2 md:p-5 md:pb-0">
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
                  isMulti
                  control={control}
                  options={listLocations}
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
                  disabled={!watch("location_name")}
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

                <NumberInput
                  label="Status Level"
                  register={register}
                  name="status_level"
                  isInvalid={errors.status_level}
                  isRequired
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
              </div>
            </div> */}
          </div>

          <div className="flex gap-5 p-2 md:p-5">
            <SecondaryButton
              onClick={!loading ? props.onClose : () => {}}
              type="button"
            >
              Discard Changes
            </SecondaryButton>

            <Button
              loading={loading}
              formNoValidate="formnovalidate"
              type="submit"
            >
              <span className="text-sm text-white">Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditDisplayNameModal;
