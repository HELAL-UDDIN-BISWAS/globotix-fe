"use client";
import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import Page from "@/components/layout/page";
import useConfiguration from "@/hooks/useConfiguration";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const ConfigurationEdit = () => {
  const { showToast, showToastError } = useToast();
  const { loading, updateConfiguration, listConfiguration } =
    useConfiguration();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    reset({
      tryTimes: listConfiguration?.attributes?.max_login_attempts,
      suspendingTimes:
        listConfiguration?.attributes?.locked_out_time_in_minutes,
    });
  }, [listConfiguration]);

  const submit = async (data) => {
    try {
      await updateConfiguration({
        max_login_attempts: parseInt(data?.tryTimes, 10),
        locked_out_time_in_minutes: parseInt(data?.suspendingTimes, 10),
      });

      showToast("Configuration-manager has been updated");
      router.push("/configuration-manager");
    } catch (error) {
      showToastError(
        error?.response?.data?.msg ||
          error?.response?.data?.message ||
          "something went wrong "
      );
    }
  };
  return (
    <Page title="Configuration Manager">
      <form onSubmit={handleSubmit(submit)}>
        <div className="shadow-lg m-3 rounded p-6 bg-white">
          <p className="text-titleFontColor font-bold mb-4">
            Configuration Details
          </p>
          <div className="w-1/3">
            <div className="mb-4">
              <label
                htmlFor="tryTimes"
                className="block text-sm font-medium text-[#6b7280]"
              >
                Try Times
              </label>
              <div className="flex mt-1 ">
                <input
                  type="number"
                  id="tryTimes"
                  {...register("tryTimes")}
                  className="flex-1 block w-full rounded-l-md border border-[#d1d5db] p-2 shadow-sm outline-[#eab308] sm:text-sm"
                />
                <span className="flex items-center text-[#6b7280] bg-[#e5e7eb] px-8 rounded-r-md">
                  Times
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="suspendingTimes"
                className="block text-sm font-medium text-[#6b7280]"
              >
                Suspending Times
              </label>
              <div className="flex mt-1">
                <input
                  type="number"
                  id="suspendingTimes"
                  {...register("suspendingTimes")}
                  className="flex-1 block w-full rounded-l-md border border-[#d1d5db] p-2 shadow-sm outline-[#eab308] sm:text-sm"
                />
                <span className="flex items-center text-[#6b7280] bg-[#e5e7eb] px-6 rounded-r-md">
                  Minutes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 p-3">
          <SecondaryButton
            type="button"
            onClick={() => router.push("/configuration-manager")}
          >
            Discard Changes
          </SecondaryButton>

          <Button type="submit">
            <span className="text-sm text-white">Save Changes</span>
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default ConfigurationEdit;
