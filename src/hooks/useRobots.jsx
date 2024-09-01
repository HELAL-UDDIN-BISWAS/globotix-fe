import { create } from "zustand";

import apolloClient from "@/lib/apolloClient";
import { CREATE_ROBOT, UPDATE_ROBOT } from "@/graphql/mutation/robot";
import { GET_ALL_ROBOTS, GET_ROBOT_BY_ID } from "@/graphql/queries/robots";
import { API_URL } from "@/lib/api";
import axios from "axios";

let authLocal = JSON.parse(localStorage.getItem("authSession"));
let token =
  authLocal && authLocal.state && authLocal.state.accessToken
    ? authLocal.state.accessToken
    : "";

const useRobots = create((set, get) => ({
  isLoading: false,
  robot: {},
  coveragePerformanceDaily: {},
  issueFacedMonthly: [],
  batteryUsageMonthly: [],

  getRobotById: async (props) => {
    console.log("props", props);
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: GET_ROBOT_BY_ID,
        fetchPolicy: "network-only",
        variables: {
          id: props.id,
        },
      });
      // console.log("res", data);

      if (data?.robot?.data) {
        let robotData = {
          id: data?.robot?.data?.id,
          baseName: data?.robot?.data?.attributes?.baseName,
          displayName: data?.robot?.data?.attributes?.displayName,
          serialNumber: data?.robot?.data?.attributes?.serialNumber,
          status: data?.robot?.data?.attributes?.status,
          batteryPercentage: data?.robot?.data?.attributes?.batteryPercentage,
          building: {
            id: data?.robot?.data?.attributes?.building?.data?.id,
            name: data?.robot?.data?.attributes?.building?.data?.attributes
              ?.name,
          },
          locations: data?.robot?.data?.attributes?.locations?.data?.map(
            (location) => {
              const {
                image,
                negate,
                origin,
                resolution,
                free_thresh,
                occupied_thresh,
              } = location?.attributes?.mapMetadata;
              return {
                id: location?.id,
                name: location?.attributes?.name,
                mapName: location?.attributes?.mapName,
                mapMetadata: location?.attributes?.mapMetadata,

                // {
                //   image,
                //   negate,
                //   origin,
                //   resolution,
                //   free_thresh,
                //   occupied_thresh,
                // },
                zones: location?.attributes?.zones?.data.map((eachHome) => {
                  return {
                    id: eachHome.id,
                    title: eachHome.attributes.title,
                    type: eachHome.attributes.type,
                    repetition: eachHome.attributes.repetition,
                    order: eachHome.attributes.order,
                    trueCleanableArea: eachHome.attributes.trueCleanableArea,
                    trueCleanedArea: eachHome.attributes.trueCleanedArea,
                    points: eachHome.attributes.points,
                    zoneDurationInfo: eachHome.attributes.zoneDurationInfo,
                    metadata: eachHome.attributes.metadata,
                    position: eachHome.attributes.position,
                    name: eachHome.attributes.name,
                    coordinates: eachHome.attributes.coordinates,
                    boustrophedonPath: eachHome.attributes.boustrophedonPath,
                    voronoiPath: eachHome.attributes.voronoiPath,
                  };
                }),
                homes: location?.attributes?.homes?.data.map((eachHome) => {
                  return {
                    id: eachHome.id,
                    name: eachHome.attributes.name,
                    pose: eachHome.attributes.pose,
                  };
                }),
                map: {
                  id: location?.attributes?.map?.data?.id,
                  name: location?.attributes?.map?.data?.attributes?.name,
                  url: location?.attributes?.map?.data?.attributes?.url,
                  width: location?.attributes?.map?.data?.attributes?.width,
                  height: location?.attributes?.map?.data?.attributes?.height,
                },
                mapProhibited: {
                  id: location?.attributes?.mapProhibited?.data?.id,
                  name: location?.attributes?.mapProhibited?.data?.attributes
                    ?.name,
                  url: location?.attributes?.mapProhibited?.data?.attributes
                    ?.url,
                },
              };
            }
          ),
          cleaningPlanEditors:
            data?.robot?.data?.attributes?.cleaningPlanEditors?.data?.map(
              (plan) => {
                let cleanZonesData = plan.attributes?.CleanZones
                  ? plan.attributes?.CleanZones.map((item) => {
                      return {
                        roller: item.roller,
                        gutter: item.gutter,
                        repeat: item.repeat,
                        vacuum: item.vacuum,
                        color: item.color,
                        title: item?.zone.data?.attributes?.title,
                        id: item?.zone.data?.id,
                        zone: {
                          id: item?.zone.data?.id,
                          title: item?.zone.data?.attributes?.title,
                          position: item?.zone.data?.attributes?.position,
                          points: item?.zone.data?.attributes?.points,
                        },
                      };
                    })
                  : [];
                let blockZonesData = plan.attributes?.BlockZones
                  ? plan.attributes?.BlockZones.map((item) => {
                      return {
                        title: item?.zone.data?.attributes?.title,
                        id: item?.zone.data?.id,
                        zone: {
                          id: item?.zone.data?.id,
                          title: item?.zone.data?.attributes?.title,
                          position: item?.zone.data?.attributes?.position,
                          points: item?.zone.data?.attributes?.points,
                        },
                      };
                    })
                  : [];
                let robotsData = plan.attributes?.robots.data;
                let cleaningPlan = {
                  id: plan?.id,
                  name: plan?.attributes?.name,
                  location: plan?.attributes?.location?.data?.id,
                  building: plan?.attributes?.building?.data?.id,
                  updatedDate: plan?.attributes?.updatedAt,
                  cleanZones: cleanZonesData,
                  blockZones: blockZonesData,
                  robots: robotsData,
                  schedules: plan?.attributes?.schedules,
                };
                return cleaningPlan;
              }
            ),
        };
        set({
          robot: robotData,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log("err", err?.message);
      set({ isLoading: false });
    }
  },

  robots: [],

  getAllRobots: async () => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_ALL_ROBOTS,
        fetchPolicy: "network-only",
      });

      if (response?.data?.robots?.data) {
        let robots = response?.data?.robots?.data?.map((item) => ({
          id: item?.id,
          name: item?.attributes?.displayName,
        }));

        set({ robots: robots });
      }
    } catch (error) {
      console.log("error", error);
    }
  },

  getDailyCoveragePerformance: async ({ robotId }) => {
    try {
      set({ loading: true });

      const response = await axios.request({
        url:
          API_URL +
          `/api/report/robots/${robotId}/coverage_performance_by_daily`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
        responseType: "json",
      });

      if (response?.status == 200) {
        set({
          coveragePerformanceDaily:
            response?.data?.data?.cleaningReport?.coveragePerformanceByDaily,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error: ", error);
    }
  },

  getMonthlyIssueFaced: async ({ robotId }) => {
    try {
      set({ loading: true });

      const response = await axios.request({
        url:
          API_URL +
          `/api/report/robots/${robotId}/overall_issue_faced_by_monthly`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
        responseType: "json",
      });

      if (response?.status == 200) {
        set({
          issueFacedMonthly:
            response?.data?.data?.cleaningReport?.overallIssueFacedByMonthly,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error: ", error);
    }
  },

  getMonthlyBatteryUsage: async ({ robotId }) => {
    try {
      set({ loading: true });

      const response = await axios.request({
        url:
          API_URL +
          `/api/report/robots/${robotId}/overall_battery_usage_by_monthly`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
        responseType: "json",
      });

      if (response?.status == 200) {
        set({
          batteryUsageMonthly:
            response?.data?.data?.cleaningReport?.overallBatteryUsageByMonthly,
        });
      }
    } catch (error) {
      set({ loading: false });
      console.log("error: ", error);
    }
  },

  createRobot: async (props) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ROBOT,
        fetchPolicy: "network-only",
        variables: {
          data: props?.payload,
        },
      });

      if (data?.createRobot?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  },

  updateRobot: async (props) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ROBOT,
        fetchPolicy: "network-only",
        variables: {
          id: props?.id,
          data: props?.payload,
        },
      });

      if (data?.updateRobot.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  },
}));

export default useRobots;
