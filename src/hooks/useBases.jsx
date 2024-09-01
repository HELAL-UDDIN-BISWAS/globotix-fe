import { create } from "zustand";

import apolloClient from "@/lib/apolloClient";
import { GET_ROBOTS, GET_ROBOT_DATA } from "@/graphql/queries/robots";

const useBases = create((set, get) => ({
  isLoading: false,
  user: [],
  offlineRobots: [],
  onlineRobots: [],
  allRobots: [],

  getAllRobots: async (props) => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_ROBOTS,
        fetchPolicy: "network-only",
      });
      let onlineRobots = {
        critical: [],
        warning: [],
        good: [],
        idle: [],
      };

      let offlineRobots = [];

      if (response?.data?.robots?.data) {
        response.data.robots.data.map((item) => {
          const robot = {
            id: item?.id,
            status: item?.attributes?.status,
            displayName: item?.attributes?.displayName,
            battery: item?.attributes?.batteryPercentage,
            serialNumber: item?.attributes?.serialNumber,
            location:
              item?.attributes?.building?.data?.attributes?.locations?.data[0]
                ?.attributes?.name,
            baseName: item?.attributes?.baseName,
            building: item?.attributes?.building?.data?.attributes?.name,
            cleaningPlan: item?.attributes?.cleaningPlanEditors?.data?.map(
              (plan) => plan?.attributes?.name
            ),
            wireguardIp: item?.attributes?.wireguardIp,
            firmwareVersion: item?.attributes?.firmwareVersion,
            license: item?.attributes?.license,
            workingStatus: item?.attributes?.workingStatus,
            statusLevel: item?.attributes?.statusLevel,
            gutterBrushUsage: item?.attributes?.gutterBrushUsage,
            chargingTime: item?.attributes?.chargingTime,
            deployedTime: item?.attributes?.deployedTime,
            status: item?.attributes?.status,
            zonePosition: item?.attributes?.zonePosition,
          };

          if (item?.attributes?.workingStatus === "Online") {
            switch (item?.attributes?.status?.toLowerCase()) {
              case "critical":
                onlineRobots.critical.push(robot);
                break;
              case "warning":
                onlineRobots.warning.push(robot);
                break;
              case "good":
                onlineRobots.good.push(robot);
                break;
              case "idle":
                onlineRobots.idle.push(robot);
                break;
            }
          }
          if (
            item?.attributes?.workingStatus === "Offline" &&
            item?.attributes?.status?.toLowerCase() === "base"
          ) {
            offlineRobots.push(robot);
          }
        });
        let allRobots = response.data.robots.data.map((item) => ({
          id: item?.id,
          status: item?.attributes?.status,
          displayName: item?.attributes?.displayName,
          battery: item?.attributes?.batteryPercentage,
          serialNumber: item?.attributes?.serialNumber,
          location:
            item?.attributes?.building?.data?.attributes?.locations?.data[0]
              ?.attributes?.name,
        }));
        set({
          onlineRobots: onlineRobots,
          offlineRobots: offlineRobots,
          allRobots: allRobots,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
}));

export default useBases;
