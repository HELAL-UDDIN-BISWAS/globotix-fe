import { useCallback, useEffect, useState } from "react";
import apolloClient from "@/lib/apolloClient";
import { GET_ALL_LOCATIONS, GET_MAP_NAMES } from "@/graphql/queries/locations";
import { UPDATE_LOCATION } from "@/graphql/mutation/location";
import _ from "lodash";

const useLocation = () => {
  const [data, setData] = useState();
  const [mapNames, setMapNames] = useState();
  const fetchData = useCallback(async (search = "", filterData, buildingId) => {
    let filters = { and: [] };
    if (search) {
      filters.and = _.concat(filters.and, {
        name: { containsi: search },
      });
    }
    if (filterData?.building && filterData?.building?.length > 0) {
      filters.and = _.concat(filters.and, {
        building: {
          id: {
            in: filterData?.building?.map((data) => data),
          },
        },
      });
    }
    if (filterData?.map && filterData?.map?.length > 0) {
      filters.and = _.concat(filters.and, {
        mapName: {
          in: filterData?.map?.map((data) => data),
        },
      });
    }
    if (buildingId) {
      filters.and = _.concat(filters.and, {
        building: {
          id: {
            eq: buildingId,
          },
        },
      });
    }
    let response = await apolloClient.query({
      query: GET_ALL_LOCATIONS,
      fetchPolicy: "network-only",
      variables: {
        filters: filters,
      },
    });

    if (response?.data?.locations?.data) {
      let buildings = response?.data?.locations?.data?.map((item) => {
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
          createdBy:
            item?.attributes?.createdByUser?.data?.attributes?.username,
          updatedBy:
            item?.attributes?.modifiedByUser?.data?.attributes?.username,
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
      setData(buildings);
    }
  }, []);
  const updateLocation = useCallback(async (id = false, payload = null) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_LOCATION,
        fetchPolicy: "network-only",
        variables: {
          id: id,
          data: payload,
        },
      });

      if (data?.updateLocation?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  }, []);
  const fetchMapNames = useCallback(async (search = "") => {
    let response = await apolloClient.query({
      query: GET_MAP_NAMES,
      fetchPolicy: "network-only",
      variables: {
        filters: {
          mapName: {
            containsi: search,
          },
        },
      },
    });

    if (response?.data?.locations?.data) {
      let mapNames = response?.data?.locations?.data?.map(
        (item) => item?.attributes?.mapName
      );
      const uniqueMapNames = _.uniq(mapNames);
      setMapNames(uniqueMapNames);
    }
  }, []);
  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);
  useEffect(() => {
    fetchMapNames().catch(console.error);
  }, [fetchMapNames]);

  return { data, mapNames, fetchData, updateLocation, fetchMapNames };
};

export default useLocation;
