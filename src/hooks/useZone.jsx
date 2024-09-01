import { useCallback, useEffect, useState } from "react";
import apolloClient from "@/lib/apolloClient";
import { GET_ZONES } from "@/graphql/queries/zone";

const useZone = () => {
  const [data, setData] = useState();

  const fetchData = useCallback(async (locationId) => {
    let response = await apolloClient.query({
      query: GET_ZONES,
      fetchPolicy: "network-only",
      variables: {
        filters: {
          location: {
            id: {
              eqi: locationId,
            },
          },
        },
      },
    });
    if (response?.data?.zones?.data) {
      setData(response?.data?.zones?.data);
    }
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  return { data, fetchData };
};

export default useZone;
