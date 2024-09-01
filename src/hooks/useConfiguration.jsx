import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_CONFIGURATION } from "@/graphql/queries/configuration";
import { UPDATE_CONFIGURATION } from "@/graphql/mutation/configuration";

const useConfiguration = create((set, get) => ({
  isLoading: false,
  listConfiguration: null,

  getConfiguration: async () => {
    try {
      set({ isLoading: true });
      const response = await apolloClient.query({
        query: GET_CONFIGURATION,
        fetchPolicy: "network-only",
      });

      if (response?.data?.configuration?.data) {
        set({ listConfiguration: response?.data?.configuration?.data });
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateConfiguration: async (data) => {
    try {
      set({ isLoading: true });
      const response = await apolloClient.mutate({
        mutation: UPDATE_CONFIGURATION,
        variables: { data },
      });

      if (response?.data?.updateConfiguration?.data) {
        // Update the state with the new configuration data
        set({ listConfiguration: response?.data?.updateConfiguration?.data });
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useConfiguration;
