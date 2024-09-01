import { useCallback, useEffect, useState } from "react";
import apolloClient from "@/lib/apolloClient";
import { GET_ALL_REPORTS } from "@/graphql/queries/reports";
import _, { isArray } from "lodash";
import dayjs from "dayjs";

const useReports = () => {
  const [data, setData] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (searchInput, filter = {}, dateFilter = {}, pagination = {}) => {
      setLoading(true);
      let filters = { and: [] };

      if (searchInput) {
        filters.and = _.concat(filters.and, {
          or: [
            {
              location: { building: { name: { containsi: searchInput } } },
            },
            { location: { name: { containsi: searchInput } } },
          ],
        });
      }
      if (filter?.robot_id) {
        if (isArray(filter?.robot_id)) {
          filters.and.push({ robot: { id: { in: filter.robot_id } } });
        } else {
          filters.and.push({ robot: { id: { eq: filter.robot_id } } });
        }
      }
      if (filter?.cleaning_status?.length) {
        filters.and.push({ cleaningStatus: { in: filter.cleaning_status } });
      }
      if (filter?.buildings) {
        filters.and.push({
          robot: { building: { id: { in: filter?.buildings } } },
        });
      }
      if (dateFilter?.min_date && dateFilter?.max_date) {
        filters.and.push(
          {
            startIso8601Time: {
              gte: dayjs(dateFilter.min_date).format("YYYY-MM-DD"),
            },
          },
          {
            endIso8601Time: {
              lte: dayjs(dateFilter.max_date).format("YYYY-MM-DD"),
            },
          }
        );
      }

      try {
        console.log("Fetching reports...");
        const response = await apolloClient.query({
          query: GET_ALL_REPORTS,
          fetchPolicy: "network-only",
          variables: {
            filters: filters,
            page: pagination?.page,
            pageSize: pagination?.pageSize,
            sort: ["startIso8601Time:desc"],
          },
        });

        const reportsData = response?.data?.reports?.data;
        if (reportsData) {
          console.log("Data fetched successfully:", reportsData);
          setData(reportsData);
          setPageCount(
            response?.data?.reports?.meta?.pagination?.pageCount || 0
          );
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // useEffect(() => {
  //   fetchData().catch(console.error);
  // }, [fetchData]);

  return { data, pageCount, fetchData, loading };
};

export default useReports;
