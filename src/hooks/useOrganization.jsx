import { useCallback, useEffect, useState } from "react";

import { GET_ORG } from "@/graphql/queries/organization";
import apolloClient from "@/lib/apolloClient";
import {
  CREATE_ORGANIZATION,
  DELETE_ORG,
  UPDATE_ORG,
} from "@/graphql/mutation/organization";

const useOrganization = () => {
  const [data, setData] = useState([]);
  const [singleOrgData, setSingleOrgData] = useState([]);

  const fetchData = useCallback(async (search = "", filterData) => {
    console.log("here filterDAta", filterData);
    let filters = { and: [] };
    if (search) {
      filters.and = _.concat(filters.and, {
        buildings: {
          name: { containsi: search },
        },
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
    if (filterData?.contactPerson && filterData?.contactPerson?.length > 0) {
      filters.and = _.concat(filters.and, {
        buildings: {
          contactPerson: {
            in: filterData?.contactPerson?.map((data) => data),
          },
        },
      });
    }
    if (filterData?.status && filterData?.status?.length > 0) {
      filters.and = _.concat(filters.and, {
        buildings: {
          status: {
            in: filterData?.status?.map((data) => data),
          },
        },
      });
    }
    let response = await apolloClient.query({
      query: GET_ORG,
      variables: {
        filters: filters,
      },
      fetchPolicy: "network-only",
    });

    if (response?.data?.organizations?.data) {
      let org = response?.data?.organizations?.data?.map((item) => ({
        id: item?.id,
        name: item?.attributes?.name,
        contactPerson: item?.attributes?.users?.data[0]?.attributes?.username,
        email: item?.attributes?.users?.data[0]?.attributes?.email,
        mobileNumber:
          item?.attributes?.users?.data[0]?.attributes?.mobileNumber,
        logoUrl: item?.attributes?.logo?.data?.attributes?.url,
        logoId: item?.attributes?.logo?.data?.id,
        total_building: item?.attributes?.buildings?.data?.length,
      }));
      setData(org);
    }
  }, []);
  const fetchSingleOrgData = useCallback(async (nameFilter) => {
    let response = await apolloClient.query({
      query: GET_ORG,
      variables: {
        filters: {
          name: {
            containsi: nameFilter,
          },
        },
      },
      fetchPolicy: "network-only",
    });

    if (response?.data?.organizations?.data) {
      let singOrgData = response?.data?.organizations?.data[0];
      console.log(singOrgData);
      let org = {
        id: singOrgData?.id,
        name: singOrgData?.attributes?.name,
        contactPerson:
          singOrgData?.attributes?.users?.data[0]?.attributes?.username,
        email: singOrgData?.attributes?.users?.data[0]?.attributes?.email,
        mobileNumber:
          singOrgData?.attributes?.users?.data[0]?.attributes?.mobileNumber,
        logoUrl: singOrgData?.attributes?.logo?.data?.attributes?.url,
        logoId: singOrgData?.attributes?.logo?.data?.id,
        total_building: singOrgData?.attributes?.buildings?.data?.length,
        buildings: singOrgData?.attributes?.buildings?.data,
      };
      setSingleOrgData(org);
    }
  });

  const createOrg = useCallback(async (payload = null) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ORGANIZATION,
        fetchPolicy: "network-only",
        variables: {
          data: payload,
        },
      });

      if (data?.createOrganization?.data?.id) {
        return { status: 200, orgId: data?.createOrganization?.data?.id };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  }, []);
  const deleteOrg = useCallback(async (id = null) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_ORG,
        fetchPolicy: "network-only",
        variables: {
          id: id,
        },
      });

      if (data?.deleteOrganization?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  }, []);
  const updateOrg = useCallback(async (id = null, payload = null) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ORG,
        fetchPolicy: "network-only",
        variables: {
          id: id,
          data: payload,
        },
      });

      if (data?.updateOrganization?.data?.id) {
        return { status: 200 };
      }
    } catch (err) {
      console.log("err", err?.message);
      return err?.message;
    }
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  return {
    data,
    fetchData,
    createOrg,
    deleteOrg,
    updateOrg,
    singleOrgData,
    fetchSingleOrgData,
  };
};

export default useOrganization;
