import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_PLANS, GET_PLAN_By_ID } from "@/graphql/queries/cleaningPlan";
import { DELETE_CLEANING_PLAN_EDITOR } from "@/graphql/mutation/cleaning-plan";
import _ from "lodash";
import useAuth from "./useAuth";

const useCleaningPlanEditor = create((set, get) => ({
  isLoading: false,
  plans: [],
  plan: null,
  zones: [],
  pageCount: 1,

  setZones: (zone) => {
    set({ zones: zone });
  },

  getCleaningPlan: async (props) => {
    const { user } = useAuth.getState();
    let filters = { and: [] };
    // filters.and = _.concat(filters.and, {
    //   createdByUser: { id: { eq: user?.id } },
    // });
    if (props?.keywords) {
      filters.and = _.concat(filters.and, {
        name: { containsi: props?.keywords },
      });
    }
    if (props?.robotId) {
      filters.and = _.concat(filters.and, {
        robots: { id: { eq: props?.robotId } },
      });
    }
    if (props?.building && props?.building?.length > 0) {
      filters.and = _.concat(filters.and, {
        building: {
          id: {
            in: props?.building?.map((data) => data),
          },
        },
      });
    }
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_PLANS,
        fetchPolicy: "network-only",
        variables: {
          filter: filters,
          pageSize: props?.pageSize,
          page: props?.page,
        },
      });

      if (response?.data?.cleaningPlanEditors?.data) {
        let cleaningPlan = response?.data?.cleaningPlanEditors?.data?.map(
          (item) => ({
            id: item?.id,
            name: item?.attributes?.name,
            location: item?.attributes?.location?.data?.attributes?.name,
            building: item?.attributes?.building?.data?.attributes?.name,
            updatedDate: item?.attributes?.updatedAt,
            createdBy:
              item?.attributes?.createdByUser?.data?.attributes?.username,
            updatedBy:
              item?.attributes?.modifiedByUser?.data?.attributes?.username,
          })
        );
        set({
          plans: cleaningPlan,
          pageCount:
            response?.data?.cleaningPlanEditors?.meta?.pagination?.pageCount,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  getCleaningPlanByID: async (props) => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_PLAN_By_ID,
        fetchPolicy: "network-only",
        variables: {
          id: props,
        },
      });
      if (response?.data?.cleaningPlanEditor?.data) {
        let responseData = response?.data?.cleaningPlanEditor?.data;
        let cleanZonesData = responseData.attributes?.CleanZones
          ? responseData.attributes?.CleanZones.map((item) => {
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
        let blockZonesData = responseData.attributes?.BlockZones
          ? responseData.attributes?.BlockZones.map((item) => {
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
        let robotsData = responseData.attributes?.robots.data;
        let cleaningPlan = {
          id: responseData?.id,
          name: responseData?.attributes?.name,
          location: responseData?.attributes?.location?.data?.id,
          building: responseData?.attributes?.building?.data?.id,
          updatedDate: responseData?.attributes?.updatedAt,
          cleanZones: cleanZonesData,
          blockZones: blockZonesData,
          robots: robotsData,
        };
        set({
          plan: cleaningPlan,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  deleteCleaningPlanEditor: async (id) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_CLEANING_PLAN_EDITOR,
        fetchPolicy: "network-only",
        variables: {
          id: parseInt(id),
        },
      });

      if (data?.deleteCleaningPlanEditor?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  },
}));

export default useCleaningPlanEditor;
