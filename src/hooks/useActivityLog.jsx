import { create } from "zustand";
import apolloClient from "@/lib/apolloClient";
import { GET_ACtiviy_Logs } from "@/graphql/queries/activitylog";

const useActivityLog = create((set, get) => ({
	loading: false,
	allActivityLog: null,

	getActivityLogs: async () => {
		try {
			set({ loading: true });
			const response = await apolloClient.query({
				query: GET_ACtiviy_Logs,
				fetchPolicy: "network-only",
			});

			if (response?.data?.activityLogs?.data) {
				set({
					allActivityLog: response?.data?.activityLogs?.data,
					loading: false,
				});
			}
		} catch (error) {
			set({ loading: false });
			console.error("Error fetching activityLogs:", error);
		} finally {
			set({ loading: false });
		}
	},
}));

export default useActivityLog;
