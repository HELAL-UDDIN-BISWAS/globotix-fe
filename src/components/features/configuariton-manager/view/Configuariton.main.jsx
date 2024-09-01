"use client";
import Page from "@/components/layout/page";
import useConfiguration from "@/hooks/useConfiguration";
import moment from "moment";
import React, { useEffect } from "react";

const ConfigurationManagement = () => {
	const { getConfiguration, loading, listConfiguration } = useConfiguration(
		(state) => ({
			loading: state?.loading,
			listConfiguration: state?.listConfiguration,
			getConfiguration: state?.getConfiguration,
		})
	);
	useEffect(() => {
		getConfiguration();
	}, [listConfiguration]);

	return (
		<Page title="Configuration Manager" configure={true}>
			<div className="shadow-md m-3 rounded p-6">
				<p className="text-titleFontColor font-bold mb-4">
					Configuration Details
				</p>
				<div className="flex flex-col gap-3">
					<p className="text-base">
						Try Times{" "}
						<span className="ml-20">
							: {listConfiguration?.attributes?.max_login_attempts}
						</span>{" "}
						<span className="ml-8">times</span>
					</p>
					<p className="text-base">
						Suspending Times{" "}
						<span className="ml-4">
							: {listConfiguration?.attributes?.locked_out_time_in_minutes}
						</span>{" "}
						<span className="ml-4">minutes</span>
					</p>
					<p className="text-base">
						Last Modified At
						<span className="ml-8">
							:{" "}
							{moment(
								new Date(listConfiguration?.attributes?.updatedAt)
							).format("DD/MM/YYYY HH:mm:ss")}
						</span>
					</p>
				</div>
			</div>
		</Page>
	);
};

export default ConfigurationManagement;
