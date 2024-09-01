import { create } from "zustand";

import { GET_ROLES } from "@/graphql/queries/roles";
import apolloClient from "@/lib/apolloClient";

const useRoles = create((set, get) => ({
  isLoading: false,
  roles: [],

  getRoles: async () => {
    try {
      set({ isLoading: true });
      let { data } = await apolloClient.query({
        query: GET_ROLES,
        fetchPolicy: "network-only",
      });

      if (data?.usersPermissionsRoles.data) {
        let roleData = data?.usersPermissionsRoles?.data?.map((role) => ({
          id: role?.id,
          name: role?.attributes?.name,
        }));
        set({ roles: roleData });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
}));

export default useRoles;
