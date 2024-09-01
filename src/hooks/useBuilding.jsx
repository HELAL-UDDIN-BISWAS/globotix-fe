import { useCallback, useEffect, useState } from "react";

import {
	GET_ALL_CONTACT_PERSON,
	GET_BUILDINGS,
	GET_BUILDING_BY_ID,
} from "@/graphql/queries/buildings";
import apolloClient from "@/lib/apolloClient";
import { CREATE_BUILDING, UPDATE_BUILDING } from "@/graphql/mutation/building";
import _ from "lodash";

const useBuilding = () => {
	const [data, setData] = useState();
	const [singleData, setSingleData] = useState();
	const [contactPerson, setContactPerson] = useState();

	const fetchData = useCallback(
		async (search = "", filterData, assignedbuilding) => {
			let filters = { and: [] };
			if (search) {
				filters.and = _.concat(filters.and, {
					name: { containsi: search },
				});
			}
			if (assignedbuilding && assignedbuilding?.length > 0) {
				filters.and = _.concat(filters.and, {
					id: {
						in: assignedbuilding.map((data) => data),
					},
				});
			}
			if (filterData?.building && filterData?.building?.length > 0) {
				filters.and = _.concat(filters.and, {
					id: {
						in: filterData?.building?.map((data) => parseInt(data)),
					},
				});
			}
			if (filterData?.contactPerson && filterData?.contactPerson?.length > 0) {
				filters.and = _.concat(filters.and, {
					contactPerson: {
						in: filterData?.contactPerson?.map((data) => data),
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
			if (filterData?.category) {
				filters.and = _.concat(filters.and, {
					category: { id: { in: filterData?.category?.map((data) => data) } },
				});
			}
			let response = await apolloClient.query({
				query: GET_BUILDINGS,
				fetchPolicy: "network-only",

				variables: {
					filters: filters,
				},
			});

			if (response?.data?.buildings?.data) {
				let buildings = response?.data?.buildings?.data?.map((item) => ({
					id: item?.id,
					name: item?.attributes?.name,
					address: item?.attributes?.address,
					mobileNumberCode: item?.attributes?.mobileNumberCode,
					mobileNumber: item?.attributes?.mobileNumber,
					organization: {
						id: item?.attributes?.organization?.data?.id,
						name: item?.attributes?.organization?.data?.attributes?.name,
						logoUrl:
							item?.attributes?.organization?.data?.attributes?.logo?.data
								?.attributes?.url,
						logoId:
							item?.attributes?.organization?.data?.attributes?.logo?.data?.id,
					},
					emailAddress: item?.attributes?.email,
					contactPerson: item?.attributes?.contactPerson,
					status: item?.attributes?.status,
					category: item?.attributes?.category?.data?.attributes?.name,
				}));
				setData(buildings);
			}
		},
		[]
	);

	const fetchSingleData = useCallback(async (id = false) => {
		if (id) {
			let response = await apolloClient.query({
				query: GET_BUILDING_BY_ID,
				fetchPolicy: "network-only",

				variables: {
					id: id,
				},
			});

			if (response?.data?.building?.data) {
				let building = {
					id: response?.data?.building?.data?.id,
					name: response?.data?.building?.data?.attributes?.name,
					status: response?.data?.building?.data?.attributes?.status,
					address: response?.data?.building?.data?.attributes?.address,
					mobileNumberCode:
						response?.data?.building?.data?.attributes?.mobileNumberCode,
					mobileNumber:
						response?.data?.building?.data?.attributes?.mobileNumber,
					organization: {
						id: response?.data?.building?.data?.attributes?.organization?.data
							?.id,
						name: response?.data?.building?.data?.attributes?.organization?.data
							?.attributes?.name,
						logoUrl:
							response?.data?.building?.data?.attributes?.organization?.data
								?.attributes?.logo?.data?.attributes?.url,
						logoId:
							response?.data?.building?.data?.attributes?.organization?.data
								?.attributes?.logo?.data?.id,
					},
					emailAddress: response?.data?.building?.data?.attributes?.email,
					contactPerson:
						response?.data?.building?.data?.attributes?.contactPerson,
					status: response?.data?.building?.data?.attributes?.status,
					category: {
						id: response?.data?.building?.data?.attributes?.category?.data?.id,
						name: response?.data?.building?.data?.attributes?.category?.data
							?.attributes?.name,
					},

					country: {
						name: response?.data?.building?.data?.attributes?.country?.data
							?.attributes?.name,
						id: response?.data?.building?.data?.attributes?.country?.data?.id,
					},
					assignedRobots:
						response?.data?.building?.data?.attributes?.assignedRobots?.data?.map(
							(item) => ({
								name: item?.attributes?.displayName,
								id: item?.id,
							})
						),

					postalCode: response?.data?.building?.data?.attributes?.postalCode,
				};
				setSingleData(building);
			}
		}
	}, []);
	const updateBuilding = useCallback(async (id = false, payload = null) => {
		try {
			const { data } = await apolloClient.mutate({
				mutation: UPDATE_BUILDING,
				fetchPolicy: "network-only",
				variables: {
					id: id,
					data: payload,
				},
			});

			if (data?.updateBuilding?.data?.id) {
				return { status: 200, id: data?.updateBuilding?.data?.id };
			}
		} catch (err) {
			console.log("err", err?.message);
			return err?.message;
		}
	}, []);
	const createBuilding = useCallback(async (payload = null) => {
		try {
			const { data } = await apolloClient.mutate({
				mutation: CREATE_BUILDING,
				fetchPolicy: "network-only",
				variables: {
					data: payload,
				},
			});

			if (data?.createBuilding?.data?.id) {
				return { status: 200, id: data?.createBuilding?.data?.id };
			}
		} catch (err) {
			console.log("err", err?.message);
			return err?.message;
		}
	}, []);
	const fetchDataByOrgId = useCallback(async (id = [], search = "") => {
		let response = await apolloClient.query({
			query: GET_BUILDINGS,
			fetchPolicy: "network-only",

			variables: {
				filters: {
					organization: {
						id: { in: id },
					},
					name: {
						containsi: search,
					},
				},
			},
		});

		if (response?.data?.buildings?.data) {
			let buildings = response?.data?.buildings?.data?.map((item) => ({
				id: item?.id,
				name: item?.attributes?.name,
				address: item?.attributes?.address,
				mobileNumberCode: item?.attributes?.mobileNumberCode,
				mobileNumber: item?.attributes?.mobileNumber,
				organization: {
					id: item?.attributes?.organization?.data?.id,
					name: item?.attributes?.organization?.data?.attributes?.name,
					logoUrl:
						item?.attributes?.organization?.data?.attributes?.logo?.data
							?.attributes?.url,
					logoId:
						item?.attributes?.organization?.data?.attributes?.logo?.data?.id,
				},
				emailAddress: item?.attributes?.email,
				contactPerson: item?.attributes?.contactPerson,
				status: item?.attributes?.status,
				category: item?.attributes?.category?.data?.attributes?.name,
			}));
			setData(buildings);
		}
	}, []);
	const fetchContactPerson = useCallback(async (search = "") => {
		let response = await apolloClient.query({
			query: GET_ALL_CONTACT_PERSON,
			fetchPolicy: "network-only",

			variables: {
				filters: {
					contactPerson: {
						containsi: search,
					},
				},
			},
		});

		if (response?.data?.buildings?.data) {
			let person = response?.data?.buildings?.data?.map(
				(item) => item?.attributes?.contactPerson
			);
			const uniquePerson = _.uniq(person);
			setContactPerson(uniquePerson);
		}
	}, []);
	useEffect(() => {
		fetchData().catch(console.error);
	}, [fetchData]);
	useEffect(() => {
		fetchSingleData().catch(console.error);
	}, [fetchSingleData]);
	useEffect(() => {
		fetchDataByOrgId().catch(console.error);
	}, [fetchDataByOrgId]);
	return {
		data,
		singleData,
		contactPerson,
		fetchContactPerson,
		fetchData,
		fetchSingleData,
		updateBuilding,
		createBuilding,
		fetchDataByOrgId,
	};
};

export default useBuilding;
