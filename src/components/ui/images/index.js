import NextImage from "next/image";
import { BiMessageDetail } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdArrowDropdown,
  IoMdArrowDropup,
  IoMdCheckmark,
} from "react-icons/io";
import {
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import {
  MdBlockFlipped,
  MdClose,
  MdError,
  MdOutlineEmail,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { PiChatCircleDotsFill } from "react-icons/pi";


const Icons = {
  loading: ({ ...props }) => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block animate-spin"
        {...props}
      >
        <path
          opacity="0.2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="currentColor"
        />
        <path
          d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
          fill="currentColor"
        />
      </svg>
    );
  },

  eye: MdOutlineVisibility,
  eyeOff: MdOutlineVisibilityOff,
  backArrow: IoIosArrowBack,
  close: MdClose,
  error: MdError,
  dropDownArrow: IoMdArrowDropdown,
  dropUpArrow: IoMdArrowDropup,
  dropLeftArrow: IoIosArrowBack,
  dropRightArrow: IoIosArrowForward,
  email: MdOutlineEmail,
  rate: FaRegStar,
  phone: FiPhoneCall,
  closeCircle: IoCloseCircleOutline,
  checkCircle: IoCheckmarkCircleOutline,
  chat: PiChatCircleDotsFill,
  block: MdBlockFlipped,
  checkMark: IoMdCheckmark,
  chatOutLine: IoChatbubbleEllipsesOutline,
  message: BiMessageDetail,
};

const Image = ({ src, width, className, height, alt, ...props }) => {
  return (
    <NextImage
      className={className}
      src={src}
      width={width || 0}
      height={height || 0}
      alt={alt}
      {...props}
    />
  );
};

export { Icons, Image };
