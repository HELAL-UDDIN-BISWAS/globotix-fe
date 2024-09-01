"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ButtonOptionChoose from "@/components/button/optionChoose.button";
import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import DateInput from "@/components/form/date.input";
import NumberInput from "@/components/form/number.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import IconBrush from "@/components/icons/iconBrush";
import Page from "@/components/layout/page";
import ROBOT from "@/const/robot";
import { useToast } from "@/hooks/useToast";
import { yupResolver } from "@hookform/resolvers/yup";

import PreventiveMaintenanceTarget from "../preventiveMaintenanceTarget";

const RobotModuleAddView = () => {
  const { showToast, showToastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [robot, setRobot] = useState(ROBOT.MODULE);
  const [openPMTarget, setOpenPMTarget] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object().shape({});
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm(formOptions);

  const onSubmit = async (data) => {};

  return (
    <>
      <PreventiveMaintenanceTarget
        open={openPMTarget}
        onClose={() => setOpenPMTarget(false)}
      />
      <Page title={"New Robot"}>
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
                    label="Serial Number"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Full Name"
                    isInvalid={errors.name}
                    isRequired
                  />

                  <TextInput
                    label="Display Name"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Full Name"
                    isInvalid={errors.name}
                    isRequired
                  />

                  <div className="flex flex-col">
                    <label className={`text-xs ${FontHind.className}`}>
                      Robot Type
                    </label>
                    <div className="flex py-1.5 h-[45px] item-center space-x-2.5">
                      <ButtonOptionChoose isStatic active={false} text="Base" />

                      <ButtonOptionChoose
                        isStatic
                        active={true}
                        text="Module"
                      />
                    </div>
                  </div>

                  <SelectInput
                    label="Account"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Account"
                    isInvalid={errors.aaaa}
                    isRequired
                    control={control}
                    options={[]}
                  />

                  <SelectInput
                    label="Location"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Location"
                    isInvalid={errors.aaaa}
                    isRequired
                    control={control}
                    options={[]}
                  />
                </div>
              </div>
              <div className="p-2 md:p-5 md:pb-0">
                <label className="text-primary font-semibold">
                  Specification
                </label>
                <div className="w-full grid grind-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <SelectInput
                    label="Model"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Model"
                    isInvalid={errors.aaaa}
                    isRequired
                    control={control}
                    options={[]}
                  />

                  <SelectInput
                    label="Hardware version"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Hardware version"
                    isInvalid={errors.aaaa}
                    isRequired
                    control={control}
                    options={[]}
                  />

                  <SelectInput
                    label="Software version"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Software version"
                    isInvalid={errors.aaaa}
                    isRequired
                    control={control}
                    options={[]}
                  />
                </div>
              </div>
              <div className="p-2 md:p-5">
                <label className="text-primary font-semibold">
                  Maintenance
                </label>
                <div className="w-full grid grind-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <SelectInput
                    label="Maintenance Package"
                    register={register}
                    name="aaaa"
                    placeholder="Type your Maintenance Package"
                    isInvalid={errors.aaaa}
                    isRequired
                    control={control}
                    options={[]}
                  />

                  <DateInput
                    label="In Service Date"
                    register={register}
                    name="aaaa"
                    placeholder=""
                    isInvalid={errors.name}
                    isRequired
                  />

                  <DateInput
                    label="Service Expire Date"
                    register={register}
                    name="aaaa"
                    placeholder=""
                    isInvalid={errors.name}
                    isRequired
                  />

                  <NumberInput
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
                  />
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
          <div className="w-full md:max-w-[280px]">
            <div className="bg-white-1 w-full rounded-[10px]">
              <div className="w-full h-[50px]">
                <div className="rounded-t-[10px] flex justify-center items-center h-full w-[70px] bg-primary text-white">
                  <IconBrush />
                </div>
              </div>
              <div className="bg-white p-4">
                <div>
                  <label className="text-primary font-semibold text-sm">
                    Filter
                  </label>
                  <div className="mt-5 space-y-2.5">
                    <DateInput
                      label="Filter Life"
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
                <div>
                  <label className="text-primary font-semibold text-sm">
                    Main Brush
                  </label>
                  <div className="mt-5 space-y-2.5">
                    <DateInput
                      label="Main Brush: Last changed date"
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
            </div>
          </div>
        </form>
      </Page>
    </>
  );
};

export default RobotModuleAddView;
