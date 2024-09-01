import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import ButtonIcon from "@/components/button/icon.button";
import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import SearchInput from "@/components/form/searchinput";
import IconEditPencilBoxSmall from "@/components/icons/iconEditPencilBoxSmall";
import IconTrash from "@/components/icons/iconTrash";
import DeleteModal from "@/components/modal/delete.modal";
import DeleteConfirmModal from "@/components/modal/delete-confirm.modal";
import useAuth from "@/hooks/useAuth";
import useOrganization from "@/hooks/useOrganization";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { isAdmin, isSuperAdmin } from "@/utils/helper";

const CardOrganization = (props) => {
  const { user } = useAuth();
  return (
    <div className="w-full flex border rounded-[10px]">
      <div className="flex flex-none w-[70px] h-[70px] p-2 border-r">
        {props?.image && (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${props.image}` || ""}
            className="w-full h-full object-contain"
            alt=""
            height={70}
            width={70}
          />
        )}
      </div>
      <div className="w-full">
        <div
          className={`p-4 w-full h-[70px] flex flex-col flex-grow justify-center items-start text-sm text-black-1 ${FontHind.className}`}
        >
          <span className="font-semibold ">{props.title}</span>
          <span>{props.info}</span>
        </div>
      </div>
      {isSuperAdmin(user?.role) && (
        <div className="flex space-x-5 h-[70px] justify-center items-center px-5">
          <ButtonIcon
            onClick={() => props.onEdit()}
            icon={<IconEditPencilBoxSmall />}
          />

          {props.canDelete && (
            <ButtonIcon
              onClick={() => props.onDelete()}
              icon={<IconTrash />}
              color="text-red-1"
            />
          )}
        </div>
      )}
    </div>
  );
};

const ManageOrganizationForm = (props) => {
  const { user } = useAuth();
  const org = useOrganization();
  const [listOrg, setListOrg] = useState([]);
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {};

  useEffect(() => {
    if (org?.data?.length > 0) {
      setListOrg(org?.data);
    }
  }, [org.data]);

  useEffect(() => {
    if (watch("search") !== "") {
      let arr = [
        ...org?.data.filter((item) =>
          item?.name?.toLowerCase()?.includes(watch("search").toLowerCase())
        ),
      ];
      setListOrg(arr);
    } else {
      setListOrg(org?.data);
    }
  }, [watch("search")]);

  const showDelete = (id) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const showDeleteConfirm = () => {
    setOpenDelete(false);
    setOpenDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await org?.deleteOrg(selectedId);
      setLoadingDelete(false);
      setOpenDelete(false);
      setOpenDeleteConfirm(false);
      if (response?.status === 200) {
        org?.fetchData();
        props?.onRefresh();
        showToast("Organization have been deleted");
      } else {
      }
    } catch (error) {
      console.log("error", error);
      setLoadingDelete(false);
    }
  };

  const checkDeletOrg = () => {
    if (isAdmin(user?.role)) {
      return false;
    } else {
      return false;
    }
  };

  return (
    <>
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => showDeleteConfirm()}
        loading={loadingDelete}
      />

      <DeleteConfirmModal
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onDelete={() => handleDelete()}
        loading={loadingDelete}
      />

      <div className="font-bold text-2xl text-primary">Manage Organization</div>
      <div className="my-[25px]">
        <SearchInput
          register={register}
          name="search"
          placeholder="Search Organization"
          isInvalid={errors.search}
          color={"text-white"}
        />
      </div>
      <div className="space-y-2.5 max-h-[55vh] no-scrollbar overflow-y-auto">
        {listOrg?.map((item, key) => (
          <CardOrganization
            key={key}
            image={item?.logoUrl || ""}
            title={item?.name}
            info={`${item?.total_building || 0}  ${
              item?.total_building > 1 ? "buildings" : "building"
            }`}
            onEdit={() => props.onEdit(item)}
            onDelete={() => showDelete(item?.id)}
            canDelete={
              isAdmin(user?.role)
                ? user.organization?.id == item?.id
                  ? false
                  : true
                : false
            }
          />
        ))}
      </div>

      <div className="mt-[30px]">
        <Button
          type="button"
          formNoValidate="formnovalidate"
          onClick={() => props.onClose()}
        >
          <span className="text-sm text-white">Done</span>
        </Button>
      </div>
    </>
  );
};

export default ManageOrganizationForm;
