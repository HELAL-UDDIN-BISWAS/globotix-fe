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
const socket = io(API_URL, { transport: ["websocket"] });
import * as Dialog from "@radix-ui/react-dialog";
import { RxCross2 } from "react-icons/rx";
import { GoPencil } from "react-icons/go";
import useAuth from "@/hooks/useAuth";

const BotBaseDetailEdit = (props) => {
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
  const { updateRobot, robot, getRobotById } = useRobots();
  const [listBuilding, setListBuilding] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [listCleaningPlan, setListCleaningPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    if (robot) {
      reset({
        id: robot?.id,
        display_name: robot?.displayName,
        building_name: {
          value: robot?.building?.id,
          label: robot?.building?.name,
        },
        location_name: robot?.locations?.map((location) => ({
          value: location?.id,
          label: location?.name,
        })),
        cleaning_plan: robot?.cleaningPlanEditors?.map((plan) => ({
          value: plan?.id,
          label: plan?.name,
        })),
        serial_number: robot?.serialNumber,
      });
    }
  }, [robot, modalOpen]);

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

  const toggle = () => {
    setModalOpen((prev) => !prev);
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
    };

    try {
      const response = await updateRobot({ id: data.id, payload: payload });

      if (response?.status === 200) {
        setTimeout(() => {
          showToast("A new base has been updated");
        }, 2000);

        await getRobotById({ id: data.id });
        toggle();
      } else {
        showToastError("Base Error");
      }
    } catch (error) {
      showToastError(
        error?.response?.data?.msg ||
          error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  return (
    <Dialog.Root open={modalOpen} onOpenChange={toggle}>
      <button
        onClick={toggle}
        className="inline-flex gap-1 items-center text-hyperLinkColor font-medium cursor-pointer "
      >
        <GoPencil /> Edit Detail
      </button>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] w-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-xl font-semibold text-titleFontColor flex gap-[5px] items-center justify-between">
            Edit Robot Details
            <button onClick={toggle} aria-label="Close">
              <IoCloseOutline size={24} />
            </button>
          </Dialog.Title>
          <form onSubmit={handleSubmit(submit)}>
            <div className="overflow-y-auto">
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
                </div>
              </div>
            </div>

            <div className="flex gap-5 p-2 md:p-5">
              <SecondaryButton onClick={toggle} type="button">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BotBaseDetailEdit;
