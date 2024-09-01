"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuth = create(
  persist(
    (set, get) => ({
      user: null,

      isAuthenticated: false,

      loading: true,

      login: async (email, password) => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
            {
              email,
              password,
            }
          );

          if (response?.status === 200) {
            Cookies.set("password", password);
            Cookies.set("email", response?.data?.email);

            return response;
          }
        } catch (err) {
          const notification = err?.response?.data?.error?.message;
          console.log("err", err);
          //   notifyAndLogError({ err, notification });
          return {
            msg:
              err?.response?.data?.error?.message ||
              err?.response?.data?.message,
            time: err?.response?.data?.error?.details?.data
              ?.lockedOutTimingInMillisecond,
          };
        }
      },
      loginOtp: async (otp) => {
        try {
          const data = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/otp`,
            {
              email: Cookies.get("email"),
              otp,
            }
          );

          Cookies.remove("password");
          Cookies.remove("email");
          Cookies.set("accessToken", data.data.accessToken);
          Cookies.set("user", JSON.stringify(data.data));
          set({
            user: data?.data,
            isAuthenticated: true,
            accessToken: data?.data?.accessToken,
          });
          return data;
        } catch (error) {
          console.log("error", error);
          return error.response;
        }
      },
      logout: () => {
        Cookies.remove("user");
        Cookies.remove("accessToken");
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      getMe: async () => {
        const { accessToken } = get();
        try {
          let data = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
            {
              headers: {
                authorization: `Bearer ${
                  Cookies?.get("accessToken") || accessToken
                }`,
              },
            }
          );

          set({ loading: false });
          Cookies.set("user", JSON.stringify(data?.data));
          set({ user: data?.data });
        } catch (error) {
          set({ loading: false });
        }
      },
    }),
    {
      name: "authSession",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuth;
