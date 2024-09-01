import { create } from "zustand";

import apolloClient from "@/lib/apolloClient";
import { GET_ZONE_BY_LOCATION } from "@/graphql/queries/zone";
import { GET_ALL_LOCATIONS } from "@/graphql/queries/locations";

const useZonesByLocation = create((set, get) => ({
  isLoading: false,
  locationZones: [],
  location: null,
  locationByID: null,

  setLocation: (item) => {
    set({ location: item });
  },

  getZoneByLocation: async (locationID) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.query({
        query: GET_ZONE_BY_LOCATION,
        fetchPolicy: "network-only",
        variables: {
          locationID: locationID,
        },
      });
      if (data?.zones?.data?.length > 0) {
        const response = data?.zones?.data.map((item) => {
          return {
            id: item?.id,
            title: item?.attributes?.title,
            position: item?.attributes?.position,
            points: item?.attributes?.points,
          };
        });
        set({
          locationZones: response,
          isLoading: false,
        });
      } else {
        set({
          locationZones: null,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log("err", err);
      set({ isLoading: false });
    }
  },
  getLocationByID: async (locationID) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_LOCATIONS,
        fetchPolicy: "network-only",
        variables: {
          filters: {
            id: { eq: locationID },
          },
        },
      });
      console.log("location", data?.locations?.data);
      if (data?.locations?.data) {
        let locations = data?.locations?.data?.map((item) => {
          const zones = item.attributes.zones?.data.map((zo) => {
            return {
              id: zo?.id,
              title: zo?.attributes?.title,
              position: zo?.attributes?.position,
              points: zo?.attributes?.points,
            };
          });

          return {
            id: item?.id,
            name: item?.attributes?.name,
            lastUpdated: item?.attributes?.updatedAt,
            building: {
              id: item?.attributes?.building?.data?.id,
              name: item?.attributes?.building?.data?.attributes?.name,
              users:
                item?.attributes?.building?.data?.attributes?.users?.data?.map(
                  (item) => ({
                    id: item?.id,
                    name: item?.attributes?.name,
                  })
                ),
            },
            mapName: item?.attributes?.mapName,
            map: {
              id: item?.attributes?.map?.data?.id,
              name: item?.attributes?.map?.data?.attributes?.name,
              url: item?.attributes?.map?.data?.attributes?.url,
              width: item?.attributes?.map?.data?.attributes?.width,
              height: item?.attributes?.map?.data?.attributes?.height,
            },
            mapMetaData: item?.attributes?.mapMetadata,
            zone: zones,
          };
        });
        console.log("response", locations);
        set({
          locationByID: locations[0],
          isLoading: false,
        });
      }
    } catch (err) {
      console.log("err", err);
      set({ isLoading: false });
    }
  },
}));

export default useZonesByLocation;
