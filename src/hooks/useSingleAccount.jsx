import { create } from "zustand";

import { UPDATE_USER } from "@/graphql/mutation/users";
import { GET_USER_BY_ID } from "@/graphql/queries/users";
import apolloClient from "@/lib/apolloClient";
import useAuth from "./useAuth";

const useSingleAccount = create((set, get) => ({
	isLoading: false,
	user: [],

	getUserById: async (props) => {
		try {
			set({ isLoading: true });
			let response = await apolloClient.query({
				query: GET_USER_BY_ID,
				fetchPolicy: "network-only",
				variables: {
					id: props?.id,
				},
			});

			if (response?.data?.usersPermissionsUser?.data) {
				let userData = {
					id: response?.data?.usersPermissionsUser?.data?.id,
					name: response?.data?.usersPermissionsUser?.data?.attributes
						?.username,
					username:
						response?.data?.usersPermissionsUser?.data?.attributes?.username,
					email: response?.data?.usersPermissionsUser?.data?.attributes?.email,
					phoneCode:
						response?.data?.usersPermissionsUser?.data?.attributes
							?.mobileNumberCode,
					phoneNumber:
						response?.data?.usersPermissionsUser?.data?.attributes
							?.mobileNumber,
					organization: {
						id: response?.data?.usersPermissionsUser?.data?.attributes
							?.organization?.data?.id,
						name: response?.data?.usersPermissionsUser?.data?.attributes
							?.organization?.data?.attributes?.name,
					},
					role: response?.data?.usersPermissionsUser?.data?.attributes?.role
						?.data?.attributes?.name,

					status:
						response?.data?.usersPermissionsUser?.data?.attributes?.status,
					building:
						response?.data?.usersPermissionsUser?.data?.attributes?.buildings?.data?.map(
							(b) => ({
								id: b?.id,
								name: b?.attributes?.name,
							})
						),
				};

				set({ user: userData });
			}
		} catch (error) {
			console.log("error", error);
		}
	},
	updateUser: async (props) => {
		set({ isLoading: true });
		try {
			const { data } = await apolloClient.mutate({
				mutation: UPDATE_USER,
				fetchPolicy: "network-only",
				variables: {
					id: props?.id,
					data: props?.payload,
				},
			});

			if (data?.updateUsersPermissionsUser?.data?.id) {
				await get().getUserById({ id: props?.id });
				const updatedBuildings = get().user.building;
				useAuth.setState((state) => ({
					user: {
						...state.user,
						buildings: updatedBuildings,
					},
				}));
				return { status: 200 };
			}
		} catch (err) {
			console.log("err", err?.message);
			return err?.message;
		}
	},
}));

export default useSingleAccount;
