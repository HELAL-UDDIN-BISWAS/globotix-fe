import { useCallback, useEffect, useState } from "react";

import { GET_ROBOTS } from "@/graphql/queries/robots";
import apolloClient from "@/lib/apolloClient";
import _ from "lodash";

const useRobotsList = () => {
	const [data, setData] = useState(null);

	const fetchData = useCallback(
		async (searchDN = "", searchBN = "", filterData, assignedbuilding) => {
			let filters = { and: [] };

			if (searchDN) {
				filters.and = filters.and.concat([
					{
						displayName: { containsi: searchDN },
					},
				]);
			}
			if (assignedbuilding && assignedbuilding?.length > 0) {
				filters.and = _.concat(filters.and, {
					building: {
						id: {
							in: assignedbuilding?.map((data) => data),
						},
					},
				});
			}
			if (filterData?.building && filterData?.building?.length > 0) {
				filters.and = _.concat(filters.and, {
					building: {
						id: {
							in: filterData?.building?.map((data) => parseInt(data)),
						},
					},
				});
			}
			if (filterData?.robotData && filterData?.robotData?.length > 0) {
				filters.and = _.concat(filters.and, {
					id: {
						in: filterData?.robotData?.map((data) => data),
					},
				});
			}
			if (filterData?.status && filterData?.status?.length > 0) {
				filters.and = _.concat(filters.and, {
					status: {
						in: filterData?.status?.map((data) => data),
					},
				});
			}
			let response = await apolloClient.query({
				query: GET_ROBOTS,
				fetchPolicy: "network-only",
				variables: {
					filters: filters,
				},
			});

			if (response?.data?.robots?.data) {
				setData(response?.data?.robots?.data);
			}
		},
		[]
	);

	useEffect(() => {
		fetchData().catch(console.error);
	}, [fetchData]);

	return { data, fetchData };
};

export default useRobotsList;
