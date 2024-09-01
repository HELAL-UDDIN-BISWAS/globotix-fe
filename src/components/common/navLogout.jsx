import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const NavLogout = (props) => {
  const item = props.data;

  const [hover, setHover] = useState(false);
  const pathname = usePathname();
  const active = pathname?.includes(item.url);

  return (
    <div
      onClick={() => props?.setOpenModal(!props?.openModal)}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${
        active ? "bg-primary" : "bg-transparent hover:bg-grey-1-20-percent"
      }  relative rounded-[10px] cursor-pointer w-10 h-10 flex justify-center items-center`}
    >
      {/* <span className={`${active ? "text-primary" : "text-white"}`}> */}
      <span className={`text-primary`}>{item.icon}</span>
      <div
        className={`${
          hover ? "inline-block" : "hidden"
        }  absolute w-max top-1/2 -translate-y-1/2 left-[calc(100%)] py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
      >
        {item?.title}
      </div>
    </div>
  );
};

export default NavLogout;
