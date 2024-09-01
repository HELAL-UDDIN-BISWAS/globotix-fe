import Image from "next/image";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import IconNoti from "../icons/iconNoti";
import BreadCrumb from "../common/breadCrumb";
import { GrEdit } from "react-icons/gr";
const Header = (props) => {
  const { user } = useAuth();
  const dateMMDDYYYY = (d) => {
    d = new Date(d);
    let date = ("0" + d.getDate()).slice(-2);
    let month = ("0" + (d.getMonth() + 1)).slice(-2);
    let year = d.getFullYear();

    var seconds = ("0" + d.getSeconds()).slice(-2);
    var minutes = ("0" + d.getMinutes()).slice(-2);
    var hour = ("0" + d.getHours()).slice(-2);
    return `${date}/${month}/${year} ${hour}:${minutes}:${seconds}`;
  };

  const lastSynced = () => {
    let currDate = new Date();
    return dateMMDDYYYY(currDate);
  };

  return (
    <>
      <div className="z-40 fixed w-[calc(100%-60px)] bg-white-2 px-2 md:px-5 py-6 flex justify-between items-center">
        <div className="">
          {props.bread ? (
            <BreadCrumb />
          ) : (
            props.title && (
              <label className="text-titleFontColor w-full text-lg font-semibold flex items-center">
                {props.title}{" "}
                <span className="text-[#4878e1c8] ml-6 text-base ">
                  {props?.configure && user?.role === "admin" ? (
                    <Link
                      href="/configuration-manager/edit"
                      className="flex items-center"
                    >
                      {" "}
                      <GrEdit style={{ marginRight: "5px" }} />
                      Edit details
                    </Link>
                  ) : (
                    ""
                  )}
                </span>
              </label>
            )
          )}

          {!props?.noti && (
            <div className="flex md:hidden items-center justify-start text-black-1 w-full mt-1">
              <div
                className="mr-2.5 cursor-pointer bg-primary p-1 rounded-lg hover:bg-sec shadow-2xl"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <Image
                  src="/upload/icons/icon_refresh.svg"
                  width={10}
                  height={10}
                  alt=""
                />
              </div>
              <span className="text-black-1 text-[10px]">
                Last synced on {lastSynced()}
              </span>
            </div>
          )}
        </div>

        {props?.noti ? (
          <div className="hidden flex-1 justify-end pr-5 md:flex items-center gap-3">
            <div className=" w-[35px] h-[35px] flex items-center justify-center rounded-full">
              <IconNoti />
            </div>
            {props.children}
            <Link
              href={"/accounts/" + user?.id}
              className="rounded-full w-10 h-10 flex justify-center items-center"
            >
              <span className="text-black-1 font-semibold capitalize bg-primary w-[35px] h-[35px] flex items-center justify-center rounded-full">
                {user?.username[0]}
              </span>
            </Link>
          </div>
        ) : (
          <div className="hidden flex-1 justify-end pr-5 md:flex items-center gap-3">
            <div className="flex items-center justify-center">
              <div
                className="mr-2.5 cursor-pointer bg-primary p-1 rounded-lg hover:bg-sec shadow-2xl"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <Image
                  src="/upload/icons/icon_refresh.svg"
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
              <span className="text-black-1 text-xs mt-1">
                Last synced on {lastSynced()}
              </span>
            </div>
            {props.children}
            <Link
              href={"/accounts/" + user?.id}
              className="rounded-full w-10 h-10 flex justify-center items-center"
            >
              <span className="text-black-1 font-semibold capitalize bg-primary w-[35px] h-[35px] flex items-center justify-center rounded-full">
                {user?.username[0]}
              </span>
            </Link>
          </div>
        )}

        <div className="flex flex-col items-end md:hidden space-x-5 pr-5">
          {props?.noti ? (
            <div className="flex items-center gap-3">
              <div className=" w-[35px] h-[35px] flex items-center justify-center rounded-full">
                <IconNoti />
              </div>
              {props.children}
              <Link
                href={"/accounts/" + user?.id}
                className="rounded-full w-10 h-10 flex justify-center items-center"
              >
                <span className="text-black-1 font-semibold capitalize bg-primary w-[35px] h-[35px] flex items-center justify-center rounded-full">
                  {user?.username[0]}
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex">
              {props.children}
              <Link
                href={"/accounts/" + user?.id}
                className="rounded-full w-10 h-10 flex justify-center items-center"
              >
                <span className="text-black-1 font-semibold capitalize bg-primary w-[35px] h-[35px] flex items-center justify-center rounded-full">
                  {user?.username[0]}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
