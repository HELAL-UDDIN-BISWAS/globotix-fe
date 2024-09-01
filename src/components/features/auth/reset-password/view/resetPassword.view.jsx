"use client";
import Image from "next/image";
import BoxContainer from "../../../../layout/boxContainer";
import RobotBlack from "/public/upload/images/img_robot_black.png";
import Logo from "/public/upload/images/logo_globotix.png";
import ResetPasswordForm from "./resetPassword.form";

const ResetPasswordView = () => {
  return (
    <BoxContainer bg="bg-black">
      <div className="relative w-full h-screen bg-black">
        <Image
          className="hidden md:block absolute right-0 bottom-0 h-full max-w-[70%] object-contain object-right-bottom"
          src={RobotBlack}
          alt=""
        />
        <div className="relative z-10 w-full md:w-2/5 h-full text-white p-[50px] flex flex-col">
          <Image src={Logo} width={155} height={80} alt="" />
          <div className="flex flex-col mt-28 mb-8">
            <span className="text-white font-bold text-2xl">
              Reset Password
            </span>
            <span className="text-white font-light text-sm mt-2.5">
              Your new password should contain at least 10 characters with at
              least 1 upper case , 1 lower case and 1 digit.
            </span>
          </div>
          <ResetPasswordForm />
        </div>
      </div>
    </BoxContainer>
  );
};

export default ResetPasswordView;
