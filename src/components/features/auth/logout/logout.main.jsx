"use client";
import Image from "next/image";
import React from "react";
import Logo from "/public/upload/images/globotix_logo.png";
import { FontLeckerli } from "@/components/fonts";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
const Logout = () => {
  const router = useRouter();
  return (
    <div className=" h-screen flex flex-col m-auto items-center justify-center ">
      <Image src={Logo} alt="" width={100} height={100} />
      <p
        className={`${FontLeckerli.className} text-[100px] mb-0 text-primary mt-6`}
      >
        Thank You!
      </p>
      <p className="text-secondaryFontColor text-[40px] mb-12">
        Thanks for using our globotix app.{" "}
      </p>
      <Button
        onClick={() => router?.push("/login")}
        formNoValidate="formnovalidate"
      >
        <span className="text-sm text-white">Back To Login</span>
      </Button>
    </div>
  );
};

export default Logout;
