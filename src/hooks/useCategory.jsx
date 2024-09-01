import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_ALL_CATEGORY } from "@/graphql/queries/category";

const useCategory = create((set, get) => ({
  isLoading: false,
  listCategory: [],

  getAllCategory: async () => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_ALL_CATEGORY,
        fetchPolicy: "network-only",
      });

      if (response?.data?.categories?.data) {
        let listCategory = response?.data?.categories?.data?.map((item) => ({
          id: item?.id,
          name: item?.attributes?.name,
        }));

        set({ listCategory: listCategory });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
}));

export default useCategory;
