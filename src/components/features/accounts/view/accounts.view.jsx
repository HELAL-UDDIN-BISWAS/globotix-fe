import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { BiReset } from "react-icons/bi";

import Button from "@/components/common/button";
import SearchInput from "@/components/form/searchinput";
import Page from "@/components/layout/page";
import DeleteModal from "@/components/modal/delete.modal";
import useAccount from "@/hooks/useAccount";
import useAuth from "@/hooks/useAuth";
import useRoles from "@/hooks/useRoles";
import { useToast } from "@/hooks/useToast";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { v4 as uuid } from "uuid";
import TableAccounts from "./accounts.table";
import FilterButton from "./FilterButton";
import axios from "axios";

const AccountsView = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();
  const [isReseted, setIsReseted] = useState(false);

  const account = useAccount();
  const { getRoles, roles } = useRoles();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [filter, setFilter] = useState({
    search: "",
    limit: 10,
    organization: [],
    building: [],
    status: [],
    accessLevel: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [submitFilter, setSubmitFilter] = useState(null);
  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    account.fetchData(submitFilter);
  }, [submitFilter]);

  const handleFilter = (val) => {
    setFilter({ ...filter, ...val });
  };

  useEffect(() => {
    if (isSuperAdmin(user?.role)) {
      setAccountData(account?.data);
    } else {
      if (isOnlyAdmin(user?.role)) {
        if (account?.data?.length > 0) {
          let arr = [...account?.data];

          arr = arr.filter(
            (item) =>
              item?.attributes?.organization?.data?.id == user?.organization?.id
          );

          setAccountData([...arr]);
        } else {
          setAccountData([]);
        }
      } else {
        setAccountData(account?.data);
      }
    }
  }, [account?.data]);

  const resetFilter = () => {
    setSubmitFilter({
      search: "",
      limit: 10,
      organization: [],
      building: [],
      status: [],
      accessLevel: [],
    });
    setFilter({
      search: "",
      limit: 10,
      organization: [],
      building: [],
      status: [],
      accessLevel: [],
    });
    setOpenModal(false);
    setIsReseted(!isReseted);
  };

  const handleDelete = async () => {
    if (Array.isArray(selectedId)) {
      handleMultipleDelete();
    } else {
      handleSingleDelete();
    }
  };

  const handleSingleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${selectedId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLoadingDelete(false);

      if (response?.status === 200) {
        account.fetchData(filter);
        setSelectedId(null);
        showToast("Acount have been deleted");
        setOpenDelete(false);
      } else {
      }
    } catch (error) {
      setLoadingDelete(false);
    }
  };

  const handleMultipleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/multi-delete`,
        {
          userIds: selectedId,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLoadingDelete(false);
      if (response?.status === 200) {
        account.fetchData(filter);
        setSelectedId(null);
        showToast("Acount have been deleted");
        setOpenDelete(false);
      } else {
      }
    } catch (error) {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    setSubmitFilter({
      search: watch("search"),
    });
  }, [watch("search")]);

  const handleOpenDelete = (val) => {
    setOpenDelete(true);
    setSelectedId(val);
  };

  const applyFilter = () => {
    setIsReseted(false);
    setSubmitFilter(filter);
  };
  const closeFilterModal = () => {
    setOpenModal(false);
    setIsReseted(false);
  };

  return (
    <>
      <DeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => handleDelete()}
        loading={loadingDelete}
      />

      <Page title={"Accounts"}>
        <div className="flex px-5 flex-col md:flex-row md:items-center gap-3 md:mt-0 mt-24">
          <div className="w-[400px]">
            <SearchInput
              register={register}
              name="search"
              placeholder="Search Accounts"
              isInvalid={errors.search}
              color={"text-white"}
            />
          </div>

          <div data-testid="filter-modal" className="z-50" onClick={() => setOpenModal(!openModal)}>
            <FilterButton
              handleFilter={handleFilter}
              applyFilter={applyFilter}
              resetFilter={resetFilter}
              filter={filter}
              isReseted={isReseted}
              openModal={openModal}
              toggle={() => closeFilterModal}
            />
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => resetFilter()}
          >
            <span className="text-hyperLinkColor border border-t-0 border-l-0 border-r-0 border-b-hyperLinkColor">
              Reset
            </span>
            <BiReset fill="#599CFF" />
          </div>

          <div className="w-full flex md:justify-end mb-3">
            {isAdmin(user?.role) && (
              <Link href="/accounts/add">
                <Button>
                  <span className="text-sm text-white ">+ New Account</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="px-5 mt-5 pb-10 md:mt-0 w-full overflow-auto">
          <TableAccounts
            data={accountData || []}
            onDelete={(val) => handleOpenDelete(val)}
            onBulkDelete={(val) => handleOpenDelete(val)}
          />
        </div>
      </Page>
    </>
  );
};

export default AccountsView;
