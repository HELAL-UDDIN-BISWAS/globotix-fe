import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { utils, writeFileXLSX } from "xlsx";

import api from "@/utils/api.axios";
import axios from "axios";

const ButtonDownloadReport = (props) => {
	const [hover, setHover] = useState(false);
	const [loading, setLoading] = useState(false);
	const [report, setReport] = useState([]);
	const fitToColumn = (data) => {
		const widths = [];
		for (const field in data[0]) {
			widths.push({
				wch: Math.max(
					field.length,
					...data.map((item) => item[field]?.toString()?.length ?? 0)
				),
			});
		}
		return widths;
	};

	const calcEfficiency = (obj) => {
		let hms = obj?.attributes?.cleaningDuration;
		let arrTime = hms?.split(":");
		let seconds =
			parseInt(arrTime?.[0] || 0) * 3600 +
			parseInt(arrTime?.[1] || 0) * 60 +
			parseInt(arrTime?.[2] || 0);

		let totalCleanedArea = obj?.attributes?.cleaningZones?.reduce(
			(acc, zone) => acc + zone?.true_cleaned_area,
			0
		);

		let ret = parseFloat((totalCleanedArea / seconds) * 3600).toFixed(2);
		return ret;
	};

	// useEffect(() => {
	// 	if (props?.data?.length > 0) {
	// 		console.log("props.data", props?.data);
	// 		Promise.all(
	// 			props?.data.map((data) => {
	// 				return axios
	// 					.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/`)
	// 					.then(function (response) {
	// 						return response?.data;
	// 					});
	// 			})
	// 		).then((values) => {
	// 			console.log("reports", values);
	// 			setReport(values);
	// 		});
	// 	}
	// }, [props?.data]);
	useEffect(() => {
		if (props?.data?.length > 0) {
			setReport(props?.data);
		}
	}, [props?.data]);

	/* get state data and export to XLSX */

	const getDate = (date, idx) => {
		let removeString = date?.replace(/\\u0000/g, "")?.replace(/\\+$/, "");
		let dateStr = !isNaN(new Date(removeString?.slice(0, -1)))
			? moment(new Date(removeString?.slice(0, -1))).format(
					"DD/MM/YYYY HH:mm:ss"
			  )
			: "";

		let dateArr = dateStr.split(" ");
		return dateArr[idx];
	};

	const exportFile = async () => {
		if (loading) return;

		// if (report?.length > 0) {
		setLoading(true);
		// const reportData = await Promise.all(
		// 	props?.data.map(({ id }) => {
		// 		return axios
		// 			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/` + id)
		// 			.then(function (response) {
		// 				return response?.data;
		// 			});
		// 	})
		// ).then((values) => {
		// 	console.log("values", values);
		// 	return values;
		// });
		var object = report?.map((obj) => {
			const cleaning_zones = obj?.attributes?.cleaningZones?.map((data) => {
				return `${data?.name};${data?.true_cleaning_percentage?.toFixed(2)}%`;
			});
			let totalCleanedArea = obj?.attributes?.cleaningZones?.reduce(
				(acc, zone) => acc + zone.true_cleaned_area,
				0
			);
			let totalCleanableArea =
				obj?.attributes?.cleaningZones?.reduce(
					(acc, zone) => acc + zone.true_cleanable_area,
					0
				) || 0;

			return {
				["Cleaning Plan"]: obj?.attributes?.location?.data?.attributes?.name,
				["Location"]:
					obj?.attributes?.location?.data?.attributes?.building?.data
						?.attributes?.name,
				["Robot Name"]: obj?.attributes?.robot?.data?.attributes?.displayName,
				// ['Username']: "",
				["Start date"]: getDate(obj?.attributes?.startIso8601Time, 0),
				["Start time"]: getDate(obj?.attributes?.startIso8601Time, 1),
				["Stop date"]: getDate(obj?.attributes?.endIso8601Time, 0),
				["Stop time"]: getDate(obj?.attributes?.endIso8601Time, 1),
				["Duration taken"]: obj?.attributes?.cleaningDuration,
				["Battery usage"]: obj?.attributes?.batteryUsage
					? obj?.attributes?.batteryUsage + "%"
					: "",
				["Zones Coverage"]: cleaning_zones?.join("\n "),
				// ["Cleaning Plan"]: obj.location_name,
				["Total map size covered (m2)"]: totalCleanedArea?.toFixed(2),
				["Total map size covered (%)"]: obj?.attributes?.coveragePercentage
					? parseFloat(obj.attributes.coveragePercentage).toFixed(2) + "%"
					: "",
				["Total map size not covered (m2)"]:
					obj?.attributes?.cleaningZonesArea && obj?.attributes?.cleanedArea
						? parseFloat(
								obj.attributes.cleaningZonesArea - obj.attributes.cleanedArea
						  ).toFixed(2)
						: "",
				["Total map size not covered (%)"]: obj?.attributes?.coveragePercentage
					? parseFloat(100.0 - obj.attributes.coveragePercentage).toFixed(2) +
					  "%"
					: "",
				["Efficiency (m2/h)"]: calcEfficiency(obj) || "",
				["Cleaning Status"]: obj?.attributes?.cleaningStatus || "",
				// ['Consumable usage status']: "xxxx",
			};
		});

		const ws = utils?.json_to_sheet(object);
		ws["!cols"] = fitToColumn(object);

		const wb = utils?.book_new();
		utils.book_append_sheet(wb, ws, "Data");
		writeFileXLSX(
			wb,
			`Report_${moment(Date.now()).format("YYYY-MM-DD_hh-mm-ss")}.xlsx`
		);
		setLoading(false);
		// }
	};

	const download = () => {
		var link = document.createElement("a");
		link.setAttribute("download", "download_report");
		link.href = "https://eventqiu.com/assets/reports.csv";
		document.body.appendChild(link);
		link.click();
		link.remove();
	};
	return (
		<div className="relative w-[35px] h-[35px] rounded-full border-2 border-[#BFA01D] flex justify-center items-center">
			<Image
				onMouseOver={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => exportFile()}
				src="/upload/icons/icon_download.svg"
				className="cursor-pointer"
				width={18}
				height={18}
				alt=""
			/>
			<div
				className={`${
					hover ? "inline-block" : "hidden"
				} absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-8  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}>
				{loading ? "Loading..." : "Download Reports"}
			</div>
		</div>
	);
};

export default ButtonDownloadReport;
