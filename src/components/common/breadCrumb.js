"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { FaChevronRight } from "react-icons/fa";

const BreadCrumb = () => {
  const pathname = usePathname();

  const router = useRouter();
  const path = pathname.split("/").filter((segment) => segment);
  const formatSegment = (segment) =>
    decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <div aria-label="breadcrumb">
      <ol className="flex space-x-2">
        {path.map((segment, index) => {
          const href = `/${path.slice(0, index + 1).join("/")}`;
          const isLast = index === path.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={href}
                    className="text-blue-500 hover:text-blue-700 font-semibold text-[20px] mr-4"
                  >
                    {formatSegment(segment)}
                  </Link>
                  <span className="text-[#BFA01D] text-[20px]">
                    <FaChevronRight />
                  </span>
                </>
              ) : (
                <span className="text-gray-500 ml-2 text-[#7E6E3C] font-semibold text-[20px]">
                  {formatSegment(segment)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* <div className="flex items-center gap-3 mt-3">
        <FaChevronLeft
          color="text-primary"
          className="cursor-pointer"
          onClick={() => router?.back()}
        />
        <span className="text-[#004FF0] w-full text-sm font-normal">Back</span>
      </div> */}
    </div>
  );
};

export default BreadCrumb;
