"use client";
import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import Page from "@/components/layout/page";
import useAuth from "@/hooks/useAuth";
import useBuilding from "@/hooks/useBuilding";
import useLocation from "@/hooks/useLocation";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import { isAdmin } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  building: yup.mixed().required("Building is required"),
  location: yup.mixed().required("Location is required"),
});

const CleaningPlanAddView = ({ setPlanDetail }) => {
  const router = useRouter();
  const { user } = useAuth();
  const building = useBuilding();
  const location = useLocation();

  const [listBuilding, setListBuilding] = useState([]);
  const [listLocations, setListLocations] = useState([]);

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm(formOptions);

  const submit = async (data) => {
    setPlanDetail({
      name: data.name,
      building: data.building.id,
      location: data.location.id,
    });

    router.push("/cleaning-plan/add?mode=zone");
  };

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
    } else {
      setListBuilding([]);
    }
  }, [building.data]);

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

  return (
    <Page
      title={
        <div className="flex items-center gap-4">
          <FaChevronLeft
            color="text-primary"
            className="cursor-pointer"
            onClick={() => router?.back()}
          />
          <span className="text-titleFontColor w-full text-lg font-semibold">
            New Cleaning Plan
          </span>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(submit)}
        className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black"
      >
        <div className="w-full">
          <div className="bg-white rounded-[10px] p-2 md:p-5 space-y-8">
            <div className="space-y-5">
              <div className="text-primary font-semibold">
                Enter Clean Plan Details
              </div>
              <div className="grid gap-5 w-1/2">
                <TextInput
                  label="Cleaning Plan Name"
                  register={register}
                  name="name"
                  placeholder="Cleaning Plan Name"
                  isInvalid={errors?.name}
                  isRequired
                />

                <SelectInput
                  label="Building"
                  register={register}
                  name="building"
                  isInvalid={errors.building}
                  isRequired
                  placeholder="Type your building"
                  control={control}
                  options={listBuilding}
                />

                <SelectInput
                  label="Location"
                  register={register}
                  name="location"
                  isInvalid={errors.location}
                  isRequired
                  placeholder="Type your location"
                  control={control}
                  options={listLocations}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-5 mt-5 mb-24">
            <SecondaryButton
              onClick={() => {}}
              type="button"
              className={`w-max font-semibold flex items-center bg-primary02 border border-primary justify-center py-4 px-5 h-[45px] rounded-[10px]  `}
            >
              <div className="flex space-x-2 w-max justify-center items-center text-primary">
                Cancel
              </div>
            </SecondaryButton>
            <Button type="submit">
              <span className="text-sm text-white">Continue</span>
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
};

export default CleaningPlanAddView;
