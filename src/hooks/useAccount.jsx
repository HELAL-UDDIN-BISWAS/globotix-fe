import { useCallback, useEffect, useState } from "react";
import _ from "lodash";

import { GET_USERS } from "@/graphql/queries/users";
import apolloClient from "@/lib/apolloClient";

const useAccount = () => {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async (filterData) => {
    let filters = { and: [] };
    if (filterData?.search) {
      filters.and = _.concat(filters.and, {
        username: { containsi: filterData?.search },
      });
    }
    if (filterData?.building && filterData?.building?.length > 0) {
      filters.and = _.concat(filters.and, {
        buildings: {
          id: {
            in: filterData?.building?.map((data) => data),
          },
        },
      });
    }
    if (filterData?.organization && filterData?.organization?.length > 0) {
      filters.and = _.concat(filters.and, {
        organization: {
          id: { in: filterData?.organization?.map((data) => data) },
        },
      });
    }
    if (filterData?.status && filterData?.status?.length > 0) {
      filters.and = _.concat(filters.and, {
        status: {
          in: filterData?.status?.map((data) => data?.toLowerCase()),
        },
      });
    }
    if (filterData?.accessLevel && filterData?.accessLevel?.length > 0) {
      filters.and = _.concat(filters.and, {
        role: {
          name: {
            in: filterData?.accessLevel?.map((data) => data?.toLowerCase()),
          },
        },
      });
    }

    let response = await apolloClient.query({
      query: GET_USERS,
      fetchPolicy: "network-only",
      variables: {
        filters: filters,
      },
    });

    if (response?.data?.usersPermissionsUsers?.data) {
      setData(response?.data?.usersPermissionsUsers?.data);
    }
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  return { data, fetchData };
};

export default useAccount;
