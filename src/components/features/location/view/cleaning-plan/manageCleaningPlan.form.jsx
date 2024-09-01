import ButtonIcon from "@/components/button/icon.button";
import Button from "@/components/common/button";
import { FontHind } from "@/components/fonts";
import ChecboxInput from "@/components/form/checkbox.input";
import SelectInput from "@/components/form/select.input";
import TextInput from "@/components/form/text.input";
import IconEditPencilBoxSmall from "@/components/icons/iconEditPencilBoxSmall";
import IconTrash from "@/components/icons/iconTrash";
import useOrganization from "@/hooks/useOrganization";
import { useToast } from "@/hooks/useToast";
import api from "@/utils/api.axios";
import { useForm } from "react-hook-form";

const CardOrganization = (props) => {
  return (
    <div className="w-full flex border rounded-[10px]">
      <div className="flex flex-none w-[70px] h-[70px] p-2 border-r">
        <img
          src={props.image || ""}
          className="w-full h-full object-contain"
          alt=""
          height={70}
          width={70}
        />
      </div>
      <div className="w-full">
        <div
          className={`p-4 w-full h-[70px] flex flex-col flex-grow justify-center items-start text-sm text-black-1 ${FontHind.className}`}
        >
          <span className="font-semibold ">{props.title}</span>
          <span>{props.info}</span>
        </div>
      </div>
      <div className="flex space-x-5 h-[70px] justify-center items-center px-5">
        <ButtonIcon
          onClick={() => props.onEdit()}
          icon={<IconEditPencilBoxSmall />}
        />
        <ButtonIcon
          onClick={() => props.onDelete()}
          icon={<IconTrash />}
          color="text-red-1"
        />
      </div>
    </div>
  );
};

const ManageCleaningPlanForm = (props) => {
  const org = useOrganization();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {};

  const handleDelete = async (val) => {
    try {
      const response = await api.delete(`/organization/${val}`);
      if (response?.status === 200) {
        org.fetchData();
        showToast("Organization have been deleted");
      } else {
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="font-bold text-2xl text-blue-2">New Cleaning Plan</div>

      <div className="space-y-2.5 max-h-[55vh] overflow-y-auto my-[35px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Cleaning Plan Name"
            register={register}
            name="name"
            placeholder="Type your cleaning plan"
            isInvalid={errors.name}
            color={"text-black-1"}
            isRequired
          />

          <SelectInput
            label="Access Control"
            register={register}
            name="access"
            placeholder="Select Access Control"
            control={control}
            options={[]}
          />

          <ChecboxInput
            label="Use this as default cleaning plan"
            name="keep_password"
            register={register}
            control={control}
            color="text-black-1"
          />

          <div className="mt-[35px] flex space-x-5">
            <Button
              type="button"
              formNoValidate="formnovalidate"
              onClick={() => props.onClose()}
            >
              <span className="text-sm text-white">Save Cleaning Plan</span>
            </Button>

            <button
              onClick={() => props.onClose()}
              type="button"
              className={`w-max font-semibold flex items-center justify-center py-4 px-5 h-[45px] rounded-[10px]  `}
            >
              <div className="flex space-x-2 w-max justify-center items-center text-blue-2">
                Cancel
              </div>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ManageCleaningPlanForm;
