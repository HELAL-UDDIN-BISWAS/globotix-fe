import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_SCHEDULES, GET_SCHEDULE_BY_ID } from "@/graphql/queries/schedule";
import {
  CREATE_SCHEDULE,
  DELETE_SCHEDULE,
  UPDATE_SCHEDULE,
} from "@/graphql/mutation/schedule";
import { GET_PLANS } from "@/graphql/queries/cleaningPlan";
import dayjs from "dayjs";
import { getDay } from "date-fns";

import _, { filter } from "lodash";
const WEEKDAYS = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};
const useSchedule = create((set, get) => ({
  isLoading: false,
  schedule: [],
  schedules: [],
  plan: [],
  pageCount: 1,

  getSchedules: async ({ selectedDates }) => {
    const filters = {};

    if (selectedDates !== null || selectedDates !== undefined) {
      const formattedDates = selectedDates?.map((e) =>
        dayjs(e).format("YYYY-MM-DD")
      );
      filters.cleaningDate = { in: formattedDates };
    }
    // console.log("filters", filters);

    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_SCHEDULES,
        fetchPolicy: "network-only",
        variables: {
          filters,
        },
      });

      if (response?.data?.schedules?.data) {
        let schedules = response?.data?.schedules?.data.map((item) => ({
          id: item?.id,
          name: item?.attributes?.name,
          frequency: item?.attributes?.frequency,
          scheduleType: item?.attributes?.scheduleType?.split("_").join(" "),
          cleaningTime: item?.attributes?.cleaningTime,
          cleaningDate: item?.attributes?.cleaningDate,
          cleaningPlan: {
            id: item?.attributes?.cleaningPlanEditor?.data?.id,
            name: item?.attributes?.cleaningPlanEditor?.data?.attributes?.name,
            repeat: item?.attributes?.repeatUntil,
          },
          location: {
            id: item?.attributes?.location?.data?.id,
            name: item?.attributes?.location?.data?.attributes?.name,
          },
          zones: item?.attributes?.zones?.data?.map((zone) => ({
            id: zone?.id,
            title: zone?.attributes?.title,
          })),
        }));
        set({ schedules: schedules });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  getSchedulesBySelectedDates: async ({ selectedDates, filterData }) => {
    try {
      set({ loading: true });
      const response = [];
      await Promise.all(
        selectedDates?.map(async (date) => {
          const formattedDate = dayjs(date).format("YYYY-MM-DD");
          const filters = {
            and: [
              {
                or: [
                  {
                    and: [
                      { frequency: { in: ["Once"] } },
                      { cleaningDate: { eq: formattedDate } },
                    ],
                  },
                  {
                    and: [
                      { frequency: { in: ["Daily"] } },
                      { cleaningDate: { lte: formattedDate } },
                      { repeatUntil: { gte: formattedDate } },
                    ],
                  },
                  {
                    and: [
                      { frequency: { in: ["Weekly"] } },
                      { cleaningDate: { lte: formattedDate } },
                      { repeatUntil: { gte: formattedDate } },
                      { daysOfWeek: { containsi: getDay(date) } },
                    ],
                  },
                ],
              },
            ],
          };
          if (filterData?.user?.role === "admin") {
            filters.and = _.concat(filters.and, {
              cleaningPlanEditor: {
                location: {
                  robots: {
                    building: {
                      organization: {
                        id: { eq: filterData?.user?.organization?.id },
                      },
                    },
                  },
                },
              },
            });
          } else if (filterData?.user?.role === "user") {
            filters.and = _.concat(filters.and, {
              cleaningPlanEditor: {
                location: {
                  robots: {
                    building: {
                      id: { in: filterData?.user?.buildings?.map((e) => e.id) },
                    },
                  },
                },
              },
            });
          }
          if (filterData?.building && filterData?.building?.length > 0) {
            filters.and = _.concat(filters.and, {
              cleaningPlanEditor: {
                building: {
                  id: {
                    in: filterData?.building?.map((data) => data),
                  },
                },
              },
            });
          }
          if (
            filterData?.organization &&
            filterData?.organization?.length > 0
          ) {
            filters.and = _.concat(filters.and, {
              cleaningPlanEditor: {
                building: {
                  organization: {
                    id: {
                      in: filterData?.organization?.map((data) => data),
                    },
                  },
                },
              },
            });
          }
          if (filterData?.robotData && filterData?.robotData?.length > 0) {
            filters.and = _.concat(filters.and, {
              cleaningPlanEditor: {
                robots: {
                  id: {
                    in: filterData?.robotData?.map((data) => data),
                  },
                },
              },
            });
          }

          const res = await apolloClient.query({
            query: GET_SCHEDULES,
            fetchPolicy: "network-only",
            variables: {
              filters,
            },
          });
          if (res?.data?.schedules?.data?.length > 0) {
            const returnData = res?.data?.schedules?.data?.map((e) => ({
              ...e,
              searchDate: date,
            }));
            response.push(...returnData);
          }
        })
      );
      // console.log("schedule_res", response);

      if (response) {
        const uniqRes = _.uniqBy(response, "id");
        let schedules = uniqRes?.map((item) => ({
          id: item?.id,
          name: item?.attributes?.name,
          frequency: item?.attributes?.frequency,
          scheduleType: item?.attributes?.scheduleType?.split("_").join(" "),
          cleaningTime: item?.attributes?.cleaningTime,
          cleaningDate: item?.attributes?.cleaningDate,
          cleaningPlan: {
            id: item?.attributes?.cleaningPlanEditor?.data?.id,
            name: item?.attributes?.cleaningPlanEditor?.data?.attributes?.name,
            repeat: item?.attributes?.repeatUntil,
            location: {
              name: item?.attributes?.cleaningPlanEditor?.data?.attributes
                ?.location?.data?.attributes?.name,
            },
            cleanZones:
              item?.attributes?.cleaningPlanEditor?.data?.attributes?.CleanZones?.map(
                (e) => ({
                  name: e?.zone?.data?.attributes?.name,
                })
              ),
          },
          location: {
            id: item?.attributes?.location?.data?.id,
            name: item?.attributes?.location?.data?.attributes?.name,
          },
          zones: item?.attributes?.zones?.data?.map((zone) => ({
            id: zone?.id,
            title: zone?.attributes?.title,
          })),
        }));
        set({ schedules: schedules });
      }
      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
      });
    }
  },
  getScheduleById: async (props) => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_SCHEDULE_BY_ID,
        fetchPolicy: "network-only",
        variables: {
          id: props?.id,
        },
      });

      if (response?.data?.schedule?.data) {
        const parsedWeekDays = JSON.parse(
          response?.data?.schedule?.data?.attributes?.daysOfWeek
        );
        let schedule = {
          id: response?.data?.schedule?.data?.id,
          name: response?.data?.schedule?.data?.attributes?.name,
          frequency: response?.data?.schedule?.data?.attributes?.frequency,
          locationId:
            response?.data?.schedule?.data?.attributes?.location?.data?.id,
          zones: response?.data?.schedule?.data?.attributes?.zones?.data?.map(
            (zone) => ({
              zoneName: zone?.attributes?.title,
              id: zone?.id,
            })
          ),
          scheduleType: response?.data?.schedule?.data?.attributes?.scheduleType
            ?.split("_")
            .join(" "),
          cleaningTime:
            response?.data?.schedule?.data?.attributes?.cleaningTime,
          cleaningDate:
            response?.data?.schedule?.data?.attributes?.cleaningDate,
          cleaningPlan: {
            id: response?.data?.schedule?.data?.attributes?.cleaningPlanEditor
              ?.data?.id,
            name: response?.data?.schedule?.data?.attributes?.cleaningPlanEditor
              ?.data?.attributes?.name,
          },
          repeat: response?.data?.schedule?.data?.attributes?.repeatUntil,
          weekDays: parsedWeekDays?.map((day) => ({
            value: day,
            label: WEEKDAYS?.[day],
          })),
        };
        set({ schedule: schedule });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  getCleaningPlan: async (props) => {
    try {
      set({ isLoading: true });
      let response = await apolloClient.query({
        query: GET_PLANS,
        fetchPolicy: "network-only",
        variables: {
          filter: {
            name: { containsi: props?.keywords },
          },
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
            locationId: item?.attributes?.location?.data?.id,
            zones: item?.attributes?.CleanZones?.map((cleanZone) => ({
              zoneName: cleanZone?.zone?.data?.attributes?.title,
              id: cleanZone?.zone?.data?.id,
            })),
          })
        );

        set({
          plan: cleaningPlan,
          pageCount:
            response?.data?.cleaningPlanEditors?.meta?.pagination?.pageCount,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  updateSchedule: async (props) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_SCHEDULE,
        fetchPolicy: "network-only",
        variables: {
          id: props?.id,
          data: props?.payload,
        },
      });

      if (data?.updateSchedule?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  },
  deleteSchedule: async (props) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_SCHEDULE,
        fetchPolicy: "network-only",
        variables: {
          id: props?.id,
        },
      });

      if (data?.deleteSchedule?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  },
  createSchedule: async (props) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_SCHEDULE,
        fetchPolicy: "network-only",
        variables: {
          data: props?.payload,
        },
      });

      if (data?.createSchedule?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  },
}));

export default useSchedule;
