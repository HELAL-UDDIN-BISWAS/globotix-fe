import { useCallback, useEffect, useState } from "react";
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

const RobotBaseEditView = () => {
  const { showToast, showToastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [openPMTarget, setOpenPMTarget] = useState(false);
  const [base, setBase] = useState(null);
  const router = useRouter();
  const building = useBuilding();
  const [listBuilding, setListBuilding] = useState([]);

  const validationSchema = Yup.object().shape({
    base_name: Yup.string().required("Robot Name is required"),
    company_name: Yup.string().required("Company Name is required"),
    location_name: Yup.string().required("Location Name is required"),
    serial_number: Yup.string().required("Serial Number is required"),
    wireguard_ip: Yup.string().required("Wireguard IP is required"),
    license: Yup.string().required("License is required"),
    firmware_ver: Yup.string().required("Firmware is required"),
    status_level: Yup.string().required("Status Level is required"),
    battery_percentage: Yup.string().required("Battery Percentage is required"),
    gutter_brush_usage: Yup.string().required("Gutter Brush_usage is required"),
    cleaning_time: Yup.string().required("Cleaning Time is required"),
    deployed_time: Yup.string().required("Deployed Time is required"),
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
    if (building?.data?.length > 0) {
      let arr = building.data.map((item) => {
        return {
          ...item,
          value: item.name,
          label: item.name,
        };
      });
      setListBuilding(arr);
    }
  }, [building.data]);

  useEffect(() => {
    if (listBuilding.length > 0) {
      if (base) {
        let building = listBuilding.find(
          (item) => item.name === base.building_name
        );

        if (building) {
          setValue("building_name", building);
        }
      } else {
        setValue("building_name", listBuilding[0]);
      }
    }
  }, [listBuilding, base]);

  const fetchData = useCallback(async () => {
    const response = await api.get("/bases/" + router?.query?.slug[0]);

    if (response?.data?.code === 200) {
      const robot = response.data.data;
      setBase(robot);

      setValue("base_name", robot.base_name);
      setValue("wireguard_ip", robot.wireguard_ip);
      setValue("company_name", robot.company_name);
      setValue("license", robot.license);
      setValue("serial_number", robot.serial_number);
      setValue("firmware_ver", robot.firmware_ver);
      setValue("building_name", robot.building_name);
      setValue("location_name", robot.location_name);
      setValue("working_status", robot.status.working_status);
      setValue("status_level", robot.status.status_level);
      setValue(
        "battery_percentage",
        robot.status.hardware_status.battery_percentage
      );
      setValue(
        "gutter_brush_usage",
        robot.status.hardware_status.gutter_brush_usage
      );
      setValue("cleaning_time", robot.status.hardware_status.cleaning_time);
      setValue("deployed_time", robot.status.hardware_status.deployed_time);
    }
  }, [router?.query?.slug]);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);

    const payload = {
      wireguard_ip: data.wireguard_ip,
      company_name: data.company_name,
      building_name: data.building_name.value,
      location_name: data.location_name,
      cleaning_plan_ids: [],
    };

    try {
      const response = await api.patch("/bases/" + base?.id, payload);

      if (response?.status === 200) {
        setTimeout(() => {
          setLoading(false);
          showToast("A new base has been edited");
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
      <Page title={"Edit Robot"}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black"
        >
          <div className="w-full">
            <div className="bg-white rounded-[10px]">
              <div className="p-2 md:p-5 md:pb-0">
                <label className="text-primary font-semibold">
                  General Information
                </label>
                <div className="w-full grid grind-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <TextInput
                    label="Robot Name"
                    register={register}
                    name="base_name"
                    placeholder="Type Robot Name"
                    isInvalid={errors.base_name}
                    isRequired
                    disabled
                  />

                  <TextInput
                    label="Company Name"
                    register={register}
                    name="company_name"
                    placeholder="Type Company Name"
                    isInvalid={errors.company_name}
                    isRequired
                  />

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

                  <TextInput
                    label="Location Name"
                    register={register}
                    name="location_name"
                    placeholder="Type Location Name"
                    isInvalid={errors.location_name}
                    isRequired
                  />
                </div>
              </div>
              <div className="p-2 md:p-5 md:pb-0">
                <label className="text-primary font-semibold">
                  Specification
                </label>
                <div className="w-full grid grind-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <TextInput
                    label="Serial Number"
                    register={register}
                    name="serial_number"
                    placeholder="Type Serial Number"
                    isInvalid={errors.serial_number}
                    isRequired
                    disabled
                  />

                  <TextInput
                    label="Wireguard IP"
                    register={register}
                    name="wireguard_ip"
                    placeholder="Type Wireguard IP"
                    isInvalid={errors.wireguard_ip}
                    isRequired
                  />

                  <TextInput
                    label="License"
                    register={register}
                    name="license"
                    placeholder="Type License"
                    isInvalid={errors.license}
                    isRequired
                    disabled
                  />

                  <TextInput
                    label="Firmware Version"
                    register={register}
                    name="firmware_ver"
                    placeholder="Type Firmware Version"
                    isInvalid={errors.firmware_ver}
                    isRequired
                    disabled
                  />
                </div>
              </div>
              <div className="p-2 md:p-5">
                <label className="text-primary font-semibold">Status</label>
                <div className="w-full grid grind-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <TextInput
                    label="Working Status"
                    register={register}
                    name="working_status"
                    placeholder="Choose Working Status"
                    isInvalid={errors.working_status}
                    isRequired
                    disabled
                  />

                  <NumberInput
                    label="Status Level"
                    register={register}
                    name="status_level"
                    isInvalid={errors.status_level}
                    isRequired
                    disabled
                  />

                  <NumberInput
                    label="Battery Percentage"
                    register={register}
                    name="battery_percentage"
                    sufix="%"
                    isInvalid={errors.battery_percentage}
                    isRequired
                    disabled
                  />

                  <NumberInput
                    label="Gutter Brush Usage"
                    register={register}
                    name="gutter_brush_usage"
                    sufix="%"
                    isInvalid={errors.gutter_brush_usage}
                    isRequired
                    disabled
                  />

                  <NumberInput
                    label="Cleaning Time"
                    register={register}
                    name="cleaning_time"
                    isInvalid={errors.cleaning_time}
                    isRequired
                    disabled
                  />

                  <NumberInput
                    label="Deployed Time"
                    register={register}
                    name="deployed_time"
                    isInvalid={errors.deployed_time}
                    isRequired
                    disabled
                  />

                  {/* <NumberInput
                    label={
                      <div className="flex">
                        <span className="mr-1">
                          Preventive Maintenance Target
                        </span>
                        <Image
                          onClick={() => setOpenPMTarget(true)}
                          src="/assets/icons/icon_helper.svg"
                          width={10}
                          height={10}
                          className="cursor-pointer object-contain mb-1"
                          alt=""
                        />
                      </div>
                    }
                    register={register}
                    name="aaaa"
                    isInvalid={errors.aaa}
                    sufix="hours"
                    isRequired
                  /> */}
                </div>
              </div>
            </div>

            <div className="flex space-x-5 mt-10">
              <Button
                loading={loading}
                formNoValidate="formnovalidate"
                type="submit"
              >
                <span className="text-sm text-white">Save Changes</span>
              </Button>

              <button
                onClick={
                  !loading
                    ? () => {
                        router.push("/robots");
                      }
                    : () => {}
                }
                type="button"
                className={`w-max font-semibold flex items-center justify-center py-4 px-5 h-[45px] rounded-[10px]  `}
              >
                <div className="flex space-x-2 w-max justify-center items-center text-red-1">
                  Discard Changes
                </div>
              </button>
            </div>
          </div>

          {/* <div className="w-full md:max-w-[280px]">
            <div className="bg-white-1 w-full rounded-[10px]">
              <div className="w-full h-[50px]">
                <div className="rounded-t-[10px] flex justify-center items-center h-full w-[70px] bg-primary text-white">
                  <IconBrush />
                </div>
              </div>
              <div className="bg-white p-4">
                <label className="text-primary font-semibold text-sm">
                  Gutter Brush
                </label>
                <div className="mt-5 space-y-2.5">
                  <DateInput
                    label="Gutter Brush: Last changed date"
                    register={register}
                    name="aaaa"
                    placeholder=""
                    isInvalid={errors.name}
                    isRequired
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      label="Gutter Brush Life"
                      register={register}
                      name="aaaa"
                      isInvalid={errors.aaa}
                      isRequired
                    />
                    <SelectInput
                      label="&nbsp;"
                      register={register}
                      name="aaaa"
                      placeholder=""
                      isInvalid={errors.aaaa}
                      isRequired
                      control={control}
                      options={[]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </form>
      </Page>
    </>
  );
};

export default RobotBaseEditView;
