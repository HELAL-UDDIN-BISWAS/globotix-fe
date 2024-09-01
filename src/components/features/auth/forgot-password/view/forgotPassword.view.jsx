"use client";
import Image from "next/image";
import BoxContainer from "../../../../layout/boxContainer";
import RobotYellow from "/public/upload/images/img_robot_yellow.png";
import Logo from "/public/upload/images/logo_globotix.png";
import ForgotPasswordForm from "./forgotPassword.form";

const ForgotPasswordView = () => {
  return (
    <BoxContainer bg="bg-white">
      <div className="relative w-full h-screen bg-white">
        <Image
          className="hidden md:block absolute right-0 bottom-0 h-full max-w-[70%] object-contain object-right-bottom"
          src={RobotYellow}
          alt=""
        />
        <div className="relative z-10 w-full md:w-2/5 h-full text-white p-[50px] flex flex-col">
          <Image src={Logo} width={155} height={80} alt="" />
          <div className="flex flex-col mt-28 mb-8">
            <span className="text-black-1 font-bold text-2xl">
              Forgot Password
            </span>
            <span className="text-black-1 font-light text-sm mt-2.5">
              A reset password link will be sent to your email address.
            </span>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </BoxContainer>
  );
};

export default ForgotPasswordView;
