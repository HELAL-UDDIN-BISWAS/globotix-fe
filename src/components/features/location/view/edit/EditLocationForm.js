"use client";
import { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import TextInput from "@/components/form/text.input";
import { yupResolver } from "@hookform/resolvers/yup";

import SecondaryButton from "@/components/button/SecondaryButton";

import _ from "lodash";
import { RxCross1 } from "react-icons/rx";

const EditLocationModal = (props) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Building Name is required"),
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
    if (props?.editItem) {
      setValue("name", props?.editItem?.name);
      setValue("mapName", props?.editItem?.mapName);
    }
  }, [props?.editItem]);

  const onSubmit = (data) => {
    props?.onEdit(data);
  };

  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
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
          props.open ? "bottom-1/2 translate-y-1/2" : "-bottom-[450px]"
        } left-1/2 -translate-x-1/2 py-[25px] px-[20px] rounded-[20px] w-[90%] md:w-max h-max bg-white text-black-1`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg text-titleFontColor font-semibold">
            Edit Name
          </span>
          <div
            onClick={() => handleClose()}
            className="flex items-end justify-end cursor-pointer"
          >
            <RxCross1 />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <div className="grid grid-cols-1 w-full">
              <TextInput
                label="Location Name"
                register={register}
                name="name"
                placeholder="Location Name"
                isInvalid={errors.name}
                isRequired
              />
              <TextInput
                label="Map Name"
                register={register}
                name="mapName"
                placeholder="Map Name"
              />
            </div>

            <div className="flex space-x-5 mt-5">
              <SecondaryButton onClick={() => handleClose()} type="button">
                <div className="flex w-max justify-center items-center text-primary">
                  Discard Changes
                </div>
              </SecondaryButton>
              <Button
                loading={loading}
                type="submit"
                formNoValidate="formnovalidate"
              >
                <span className=" text-white">Save Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditLocationModal;
