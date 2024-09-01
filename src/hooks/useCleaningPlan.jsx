import { useCallback, useEffect, useState } from "react";
import { GET_CLEANING_PLANS } from "@/graphql/queries/cleaningPlan";
import apolloClient from "@/lib/apolloClient";

const useCleaningPlan = () => {
  const [data, setData] = useState();

  const fetchData = useCallback(async (locationId) => {
    let filters = {};

    if (Array.isArray(locationId)) {
      filters.location = {
        id: { and: locationId },
      };
    } else {
      filters.location = {
        id: { eqi: locationId },
      };
    }
    let response = await apolloClient.query({
      query: GET_CLEANING_PLANS,
      fetchPolicy: "network-only",
      variables: {
        filters: filters,
      },
    });
    if (response?.data?.cleaningPlanEditors?.data) {
      setData(response?.data?.cleaningPlanEditors?.data);
    }
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  return { data, fetchData };
};

export default useCleaningPlan;
