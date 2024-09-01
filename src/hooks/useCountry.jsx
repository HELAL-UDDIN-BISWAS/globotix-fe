import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";

import { GET_ALL_COUNTRY } from "@/graphql/queries/country";

const useCountry = create((set, get) => ({
  isLoading: false,
  listCountry: [],

  getAllCountry: async () => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_ALL_COUNTRY,
        fetchPolicy: "network-only",
      });

      if (response?.data?.countries?.data) {
        let listCountry = response?.data?.countries?.data?.map((item) => ({
          id: item?.id,
          name: item?.attributes?.name,
        }));

        // set({ listCountry: listCountry });
        set({ listCountry: listCountry, isLoading: false });
      }
    } catch (error) {
      console.log("error", error);
      set({ isLoading: false });
    }
  },
}));

export default useCountry;
