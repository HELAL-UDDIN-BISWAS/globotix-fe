import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavItem = (props) => {
  const item = props.data;
  const [hover, setHover] = useState(false);
  const route = useRouter();

  const active = route.pathname.includes(item.url);

  return (
    <Link
      href={item.url}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${
        active ? "bg-yellow-1" : "bg-transparent hover:bg-grey-1-20-percent"
      }  relative rounded-[10px] cursor-pointer w-10 h-10 flex justify-center items-center`}
    >
      <span className={`${active ? "text-primary" : "text-white"}`}>
        {item.icon}
      </span>
      <div
        className={`${
          hover ? "inline-block" : "hidden"
        }  absolute w-max top-1/2 -translate-y-1/2 left-[calc(100%+20px)] py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
      >
        {item.title}
      </div>
    </Link>
  );
};

export default NavItem;
