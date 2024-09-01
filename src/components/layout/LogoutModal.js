"use client";

import Button from "../common/button";
import SecondaryButton from "../button/SecondaryButton";
import LogoutIcon from "/public/upload/icons/icon_logout.svg";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const LogoutModal = (props) => {
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = async () => {
    router?.push("/logout");

    setTimeout(() => {
      logout();
    }, 500);
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
        } left-1/2 -translate-x-1/2 py-[30px] rounded-[20px] w-[400px] md:w-max h-max bg-white text-black-1`}
      >
        <div className="flex flex-col items-center justify-center mb-3">
          <Image src={LogoutIcon} alt="" width={50} height={50} />
          <span className="text-titleFontColor mt-3 text-base font-semibold capitalize">
            Hope to see you back soon
          </span>{" "}
        </div>
        <div className="text-base text-[#2F4858] w-[400px] text-center">
          Are you sure you want to logout from Globotix?
        </div>
        <div className="flex justify-center items-center w-full space-x-5 mt-10">
          <SecondaryButton
            onClick={() => handleClose()}
            loading={false}
            type="button"
          >
            <span className="text-sm text-primary">Cancel</span>
          </SecondaryButton>
          <Button
            onClick={() => handleLogout()}
            loading={props.loading}
            type="button"
          >
            <span className="text-sm text-white">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
