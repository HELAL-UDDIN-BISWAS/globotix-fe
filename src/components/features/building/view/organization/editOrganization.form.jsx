import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

import Button from "@/components/common/button";
import TextInput from "@/components/form/text.input";
import UploadInput from "@/components/form/upload.input";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { uploadFile } from "@/utils/uploadFile";
import useOrganization from "@/hooks/useOrganization";

const EditOrganizationForm = (props) => {
  const [openEditOrganization, setOpenEditOrganization] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoId, setLogoId] = useState(null);
  const { showToast, showToastError } = useToast();
  const org = useOrganization();
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  function isFile(input) {
    if ("File" in window && input instanceof File) return true;
    else return false;
  }

  useEffect(() => {
    if (props.data !== null) {
      setValue("name", props?.data?.name);

      if (props?.data?.logoUrl !== undefined && props?.data?.logoUrl !== "") {
        setLogo(props?.data?.logoUrl);
        setLogoId(props?.data?.logoId);
      }
    }
  }, [props.data]);

  const onSubmit = async (data) => {
    if (loading) return;

    if (isFile(logo)) {
      setLoading(true);

      try {
        const response = await uploadFile(logo);
        if (response) {
          edit(data?.name, response);
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
        showToastError(
          error?.response?.data?.message ||
            "Something wrong on server please try again"
        );
      }
    } else {
      edit(data?.name, logoId);
    }
  };

  const edit = async (name, path) => {
    setLoading(true);
    const payload = {
      name: name,
      logo: path,
    };

    try {
      const response = await org?.updateOrg(props?.data?.id, payload);
      if (response?.status === 200) {
        showToast("Organization have been updated");
        props.onClose();
      } else {
        showToastError(
          response?.data?.message ||
            "Something wrong on server please try again"
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showToastError(
        error?.response?.data?.msg ||
          "Something wrong on server please try again"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="font-bold text-2xl text-primary">Edit Organization</div>

        <div className="space-y-2.5 my-[25px]">
          <TextInput
            label="Organization Name"
            register={register}
            name="name"
            placeholder="Type your Full Name"
            isInvalid={errors.name}
            isRequired
          />

          <UploadInput
            label="Organization Logo"
            register={register}
            name="logo"
            placeholder="Max 5MB. Supported format: JPEG, PNG, JPG, TIFF"
            isInvalid={errors.logo}
            isRequired
            setLogo={(val) => setLogo(val)}
            value={props?.data?.logoUrl || ""}
          />
        </div>

        <div className="flex space-x-5 mt-5">
          <Button
            loading={loading}
            formNoValidate="formnovalidate"
            type="submit"
          >
            <span className="text-sm text-white">Save Changes</span>
          </Button>

          <button
            onClick={() => props.onClose()}
            type="button"
            className={`w-max font-semibold flex items-center justify-center py-4 px-5 h-[45px] rounded-[10px]  `}
          >
            <div className="flex space-x-2 w-max justify-center items-center text-primary">
              Cancel
            </div>
          </button>
        </div>
      </form>
    </>
  );
};

export default EditOrganizationForm;
