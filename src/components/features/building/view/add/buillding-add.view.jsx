"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import EmailInput from "@/components/form/email.input";
import NumberInput from "@/components/form/number.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import UploadInput from "@/components/form/upload.input";
import IconRobot from "@/components/icons/iconRobot";
import IconTrash from "@/components/icons/iconTrash";
import Page from "@/components/layout/page";
import useAuth from "@/hooks/useAuth";
import useCategory from "@/hooks/useCategory";
import useCountry from "@/hooks/useCountry";
import useOrganization from "@/hooks/useOrganization";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { yupResolver } from "@hookform/resolvers/yup";

import DUMMY_ROBOT from "../../mocks/robots.data";
import ManageOrganizations from "../organization/organizations.view";
import SecondaryButton from "@/components/button/SecondaryButton";
import { uploadFile } from "@/utils/uploadFile";
import useBuilding from "@/hooks/useBuilding";
import { FaChevronLeft } from "react-icons/fa";
import SuccessModal from "@/components/modal/success.modal";
import DiscardModal from "@/components/modal/discard-confirm.modal";
import ButtonOptionChoose from "@/components/button/optionChoose.button";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
const socket = io(API_URL, { transport: ["websocket"] });

const CardRobot = (props) => {
  return (
    <div
      className={`flex space-x-3 pr-3 border rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}
    >
      <div className="flex w-[70px] flex-none">
        <Image
          src={props?.image}
          className="w-[70px] h-[70px] rounded-l-[10px]"
          alt=""
          width={70}
          height={70}
        />
      </div>
      <div className="py-2 w-full flex flex-col justify-center items-start h-[70px]">
        <div className="text-sm font-semibold">{props?.title}</div>
        <div className={`text-sm`}>{props?.info}</div>
      </div>
      <div className=" cursor-pointer text-red-1 flex flex-none w-[15px] h-[70px]  justify-center items-center">
        <IconTrash />
      </div>
    </div>
  );
};

const BuildingAddView = () => {
  const { user } = useAuth();
  const TAB = {
    LOCATION: "LOCATION",
    ROBOT: "ROBOT",
    REPORT: "REPORT",
    USER: "USER",
  };
  const { showToast, showToastError } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState(TAB.ROBOT);
  const [openManageOrganization, setOpenManageOrganization] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [idOrg, setIdOrg] = useState("");
  const [listOrganization, setListOrganization] = useState([]);
  const organization = useOrganization();
  const building = useBuilding();
  const { getAllCategory, listCategory } = useCategory();
  const { getAllCountry, listCountry } = useCountry();
  const [successOpen, setSuccessOpen] = useState(false);
  const [openDiscard, setOpenDiscard] = useState(false);
  const [status, setStatus] = useState("Active");
  useEffect(() => {
    getAllCategory();
    getAllCountry();
  }, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Building Name is required"),
    name_organization: Yup.string().required("Organization Name is required"),
    address: Yup.string().required("Address is required"),
    contactPerson: Yup.string().required("Contact Person is required"),
    postalCode: Yup.string().required("Postal Code is required"),
    phoneNumber: Yup.string().required("Phonenumber is required"),
    emailAddress: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email address"),
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

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "category") {
      getAllCategory();
    }
  });

  useEffect(() => {
    if (isSuperAdmin(user?.role)) {
      setListOrganization([
        {
          id: "add_new",
          name: "Add New Organization",
        },
        ...organization.data,
      ]);
    } else {
      if (isOnlyAdmin(user?.role)) {
        let arr = organization?.data?.filter((v) => {
          if (v?.id == user?.organization?.id) {
            return v;
          }
        });

        setListOrganization([...arr]);
      } else {
        setListOrganization([...organization.data]);
      }
    }
  }, [organization?.data]);

  useEffect(() => {
    if (watch("organization") !== undefined) {
      if (watch("organization")?.id === "add_new") {
        setIdOrg("");
        setValue("name_organization", "");
        setLogo("");
      } else {
        setIdOrg(watch("organization")?.id);
        setValue("name_organization", watch("organization")?.name);
        setLogo(watch("organization")?.logoUrl);
      }
    }
  }, [watch("organization")]);

  useEffect(() => {
    if (listCountry?.length > 0) {
      setValue("country", listCountry[0]);
    }
  }, [listCountry, setValue]);

  useEffect(() => {
    if (listCategory?.length > 0) {
      setValue("category", listCategory[0]);
    }
  }, [listCategory, setValue]);

  useEffect(() => {
    setValue("no_ext", { value: "+65", label: "+65" });
  }, []);

  function isFile(input) {
    if ("File" in window && input instanceof File) return true;
    else return false;
  }

  const onSubmit = async (data) => {
    if (loading) return;
    if (isFile(logo)) {
      setLoading(true);

      try {
        const response = await uploadFile(logo);
        if (response) {
          const payload = {
            logo: response,
            name: data?.name_organization,
            createdByUser: user?.id,
            modifiedByUser: user?.id,
          };
          const res = await organization?.createOrg(payload);
          if (res?.status === 200) {
            onAdd(data, res?.orgId);
          }
        }
      } catch (error) {
        setLoading(false);
        showToastError(
          error?.response?.data?.message ||
            "Something wrong on server please try again"
        );
      }
    } else if (watch("organization")?.id === "add_new") {
      try {
        const payload = {
          logo: null,
          name: data?.name_organization,
          createdByUser: user?.id,
          modifiedByUser: user?.id,
        };
        const res = await organization?.createOrg(payload);

        if (res?.status === 200) {
          onAdd(data, res?.orgId);
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
      onAdd(data, idOrg);
    }
  };

  const onAdd = async (data, orgId) => {
    if (loading) return;

    setLoading(true);

    let payload = {
      name: data?.name || "",
      address: data?.address || "",
      category: data?.category.id || "",
      country: data?.country.id || "",
      postalCode: data?.postalCode || "",
      organization: orgId,
      contactPerson: data?.contactPerson || "",
      email: data?.emailAddress || "",
      mobileNumberCode: data?.no_ext.value || "",
      mobileNumber: data?.phoneNumber || "",
      status: status || null,
      createdByUser: user?.id,
      modifiedByUser: user?.id,
    };
    if (isOnlyAdmin(user?.role)) {
      payload = { ...payload, users: user?.id };
    }
    try {
      const response = await building?.createBuilding(payload);
      setLoading(false);
      if (response?.status === 200) {
        setSuccessOpen(!successOpen);
        // showToast("A new building has been created");
        // router.push("/organization");
      } else {
        showToast(
          response?.message || "Something wrong on server please try again"
        );
      }
    } catch (error) {
      setLoading(false);
      showToastError(
        error?.response?.data?.message ||
          "Something wrong on server please try again"
      );
    }
  };

  const handleCloseManageOrganization = () => {
    organization.fetchData();
    setOpenManageOrganization(false);
  };

  const handleRefreshOrg = () => {
    organization.fetchData();

    setIdOrg("");
    setValue("name_organization", "");
    setLogo("");

    if (isAdmin(user?.role)) {
      setValue("organization", {
        id: "add_new",
        name: "Add New Organization",
      });
    }
  };

  return (
    <>
      <ManageOrganizations
        onRefresh={() => handleRefreshOrg()}
        open={openManageOrganization}
        onClose={() => handleCloseManageOrganization()}
      />
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onBack={() => router?.back()}
        text={"View All Buildings"}
        successText={"New Building Added"}
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
              New Building
            </span>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black"
        >
          <div className="w-full">
            <div className="bg-white rounded-[10px] p-2 md:p-5 space-y-8">
              <div className="space-y-5">
                <div className="text-primary font-semibold">
                  Building Details
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
                  <TextInput
                    label="Building Name"
                    register={register}
                    name="name"
                    placeholder="Building Name"
                    isInvalid={errors.name}
                    isRequired
                  />

                  <SelectInput
                    label="Category"
                    register={register}
                    name="category"
                    placeholder="Type your category"
                    control={control}
                    options={listCategory}
                  />

                  <SelectInput
                    label="Country"
                    register={register}
                    name="country"
                    placeholder="Type your country"
                    isRequired
                    control={control}
                    options={listCountry}
                  />
                  <NumberInput
                    label="Postal Code"
                    register={register}
                    name="postalCode"
                    placeholder="Postal Code"
                    isInvalid={errors.postalCode}
                    isRequired
                  />
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
                  <div className="">
                    <TextInput
                      label="Address"
                      register={register}
                      name="address"
                      placeholder="Address"
                      isInvalid={errors.address}
                      isRequired
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="text-primary font-semibold">
                  Organization Details
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
                  <SelectInput
                    label="Organization"
                    register={register}
                    name="organization"
                    placeholder={
                      isSuperAdmin(user?.role)
                        ? "Add New Organization"
                        : "Select Organization"
                    }
                    control={control}
                    options={listOrganization}
                    otherInfo={
                      isSuperAdmin(user?.role) ? "Manage Organizations" : ""
                    }
                    actionOtherInfo={
                      isSuperAdmin(user?.role)
                        ? () => setOpenManageOrganization(true)
                        : () => {}
                    }
                    getOptionLabel={(option) => (
                      <div
                        className={`${
                          option._id === "add_new" ? "font-bold " : ""
                        } `}
                      >
                        {option.name}
                      </div>
                    )}
                  />

                  {(isSuperAdmin(user?.role) || idOrg !== "") && (
                    <>
                      <TextInput
                        label={
                          idOrg !== ""
                            ? "Organization Name"
                            : "New Organization Name"
                        }
                        register={register}
                        name="name_organization"
                        placeholder="Organization Name"
                        isInvalid={errors.name_organization}
                        isRequired
                        disabled={idOrg !== ""}
                      />

                      <UploadInput
                        label="Organization Logo"
                        register={register}
                        name="logo"
                        placeholder="Max 5MB. Supported format: JPEG, PNG, JPG, TIFF"
                        isInvalid={errors.logo}
                        isRequired
                        value={logo}
                        canDelete={idOrg === "" ? true : false}
                        setLogo={(val) => setLogo(val)}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="text-primary font-semibold">
                  Contact Details
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
                  <TextInput
                    label="Contact Person"
                    register={register}
                    name="contactPerson"
                    placeholder="Contact Person"
                    isInvalid={errors.contactPerson}
                    isRequired
                  />

                  <EmailInput
                    label="Email Address"
                    register={register}
                    name="emailAddress"
                    placeholder="Email Address"
                    isInvalid={errors.emailAddress}
                    isRequired
                  />

                  <div className="flex  space-x-2">
                    <div className="w-36">
                      <SelectInput
                        label="Mobile No"
                        register={register}
                        name="no_ext"
                        placeholder=""
                        isInvalid={errors.no_ext}
                        isRequired
                        control={control}
                        options={[
                          { value: "+65", label: "+65" },
                          { value: "+61", label: "+61" },
                          { value: "+81", label: "+81" },
                          { value: "+82", label: "+82" },
                          { value: "+852", label: "+852" },
                        ]}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                      />
                    </div>
                    <NumberInput
                      label="&nbsp;"
                      register={register}
                      name="phoneNumber"
                      isInvalid={errors.phoneNumber}
                      isRequired
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={`text-xs ${FontHind.className}`}>
                      Status
                    </label>
                    <div className="flex py-1.5 h-[45px] item-center space-x-2.5">
                      <ButtonOptionChoose
                        onClick={() => setStatus("Active")}
                        active={status === "Active"}
                        text="Active"
                      />

                      <ButtonOptionChoose
                        onClick={() => setStatus("Inactive")}
                        active={status === "Inactive"}
                        text="Inactive"
                      />
                    </div>
                  </div>
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
                <span className="text-sm text-white">Create Building</span>
              </Button>
            </div>
          </div>
          <div className="w-full md:max-w-[280px] hidden">
            <div className="bg-white-1 w-full rounded-[10px]">
              <div className="w-full flex h-[50px]">
                <div
                  onClick={() => setTab(TAB.ROBOT)}
                  className={`${
                    tab === TAB.ROBOT
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconRobot />
                </div>
              </div>

              {/* TAB ROBOT */}
              {/* {tab === TAB.ROBOT && (
                <div className="bg-white p-4">
                  <div className={`mb-2.5 text-sm ${FontHind.className}`}>
                    Assign robot(s) to the building
                  </div>

                  <div className="my-2.5">
                    <SelectInput
                      register={register}
                      name="search"
                      placeholder={"Search Robot"}
                      control={control}
                      options={DUMMY_ROBOT}
                      getOptionValue={(option) => option.id}
                      getOptionLabel={(option) => (
                        <div class="text-sm flex h-full  space-x-2">
                          <div className="flex justify-center items-center h-full">
                            <input
                              type="checkbox"
                              checked={false}
                              className={"cursor-pointer rounded-2xl mt-0.5"}
                              onChange={(e) => {}}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold">{option.id}</span>
                            <span>{option.name}</span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex py-1.5 h-[45px] item-center space-x-2.5">
                    <button
                      type="button"
                      className="text-xs text-white bg-primary rounded-full py-2 px-4"
                    >
                      All
                    </button>

                    <button
                      type="button"
                      className="text-xs text-primary bg-white-1 rounded-full py-2 px-4"
                    >
                      Base
                    </button>

                    <button
                      type="button"
                      className="text-xs text-primary bg-white-1 rounded-full py-2 px-4"
                    >
                      Module
                    </button>
                  </div>
                  <div className="mt-2.5 space-y-2.5">
                    <CardRobot
                      image="/assets/images/thumb_robot.png"
                      title="Base_ID"
                      info="Flexa Base"
                    />
                    <CardRobot
                      image="/assets/images/thumb_robot.png"
                      title="Base_ID"
                      info="Flexa Vacuum"
                    />
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </form>
      </Page>
    </>
  );
};

export default BuildingAddView;
