"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { MdKeyboardArrowDown } from "react-icons/md";
import { activities } from "@/data/menuList";
import IconIssue from "@/components/icons/iconIssue";
import IconSite from "@/components/icons/iconSite";
import IconACR from "@/components/icons/iconACR";
import IconBot from "@/components/icons/iconBot";
import Page from "@/components/layout/page";
import ViewAllHeader from "./ViewAllHeader";
import StatusCard from "./StatusCard";
import { subMonths, startOfDay, format } from "date-fns";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import ActivityLog from "./ActivityLog";
import IssuesList from "./IssueList";
import { useRouter } from "next/navigation";
import useActivityLog from "@/hooks/useActivityLog";
const DropdownBtn = ({
	options = [],
	onChange = () => {},
	selectedItem = "",
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex grow-0 gap-1 items-center justify-end min-w-24 focus:outline-none border-none text-sm font-semibold text-secondaryFontColor">
					{selectedItem}
					<MdKeyboardArrowDown size={14} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-white border-none p-0 text-secondaryFontColor ">
				{options?.map((item, index) => (
					<DropdownMenuItem
						key={index}
						onClick={() => onChange(item)}
						className="hover:bg-primary border-b border-gray hover:text-white flex align-center gap-[12px] px-4 py-[12px]">
						<span className="text-sm font-semibold">{item}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const remainingLinePlugin = {
	id: "remainingLine",
	afterDatasetsDraw(chart, args, options) {
		const {
			ctx,
			chartArea: { top, bottom, left, right },
			scales: { x, y },
		} = chart;

		const maxYValue =
			chart.config.type === "bar" &&
			chart.config.options.filter == "Productivity"
				? 1000
				: 100;

		chart.data.datasets[0].data.forEach((value, index) => {
			const xPosition = x.getPixelForValue(index);
			const yPosition = y.getPixelForValue(value);
			ctx.save();
			ctx.strokeStyle = "rgba(208, 213, 221, 1)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(xPosition, yPosition);
			ctx.lineTo(xPosition, y.getPixelForValue(maxYValue));
			ctx.stroke();
			ctx.restore();
		});
	},
};

const formatMonth = (month) => {
	const date = new Date(2000, month - 1, 1); // Month is zero-based
	return date?.toLocaleString("default", { month: "short" });
};

const transformData = (data, filterType) => {
	const sortedData = data?.sort((a, b) => new Date(a.date) - new Date(b.date));
	const labels = sortedData?.map((item) => formatMonth(parseInt(item?.month)));
	const chartData = sortedData?.map((item) => item?.averageRate);
	return {
		labels,
		datasets: [
			{
				label:
					filterType === "productivity"
						? "Overall Productivity "
						: "Overall Coverage Performance (%) ",
				data: chartData,
				backgroundColor: "rgba(191, 160, 29, 1)",
				barThickness: 15,
			},
		],
	};
};

const getBarChartOptions = (filterType) => {
	return {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				title: {
					display: false,
				},
				grid: {
					display: false,
				},
				border: {
					display: false,
				},
				ticks: {
					padding: 10,
					color: "rgba(102, 112, 133, 1)",
				},
				offset: true,
				padding: {
					left: 10,
					right: 10,
				},
			},
			y: {
				beginAtZero: true,
				max: filterType.toLowerCase() === "productivity" ? 1000 : 100,
				title: {
					display: true,
					text:
						filterType.toLowerCase() === "productivity"
							? "Productivity"
							: "Avg Coverage Rates %",
					color: "rgba(152, 162, 179, 1)",
					font: {
						size: 14,
						weight: 700,
					},
				},
				border: {
					display: false,
				},
				ticks: {
					stepSize: filterType.toLowerCase() === "productivity" ? 250 : 25,
					padding: 10,
					color: "rgba(102, 112, 133, 1)",
				},
				grid: {
					display: false,
				},
			},
		},
		filter: filterType,
	};
};
const transformLineData = (data, filterType) => {
	let averageRates = Array(9).fill(0);
	let counts = Array(9).fill(0);

	const defaultIntervals = [
		"00:00",
		"03:00",
		"06:00",
		"09:00",
		"12:00",
		"15:00",
		"18:00",
		"21:00",
		"24:00",
	];

	if (
		!data ||
		!Array.isArray(data) ||
		data.length === 0 ||
		!data[0]?.dailyData
	) {
		console.warn("No valid data for line chart, using default values");
		return {
			labels: defaultIntervals,
			datasets: [
				{
					label:
						filterType === "productivity"
							? "Overall Productivity "
							: "Overall Coverage Performance (%) ",
					data: averageRates,
					borderColor: "rgba(191, 160, 29, 1)",
					pointBackgroundColor: "white",
					pointBorderColor: "rgba(191, 160, 29, 1)",
					pointBorderWidth: 2,
					pointRadius: 5,
					tension: 0.9,
					fill: false,
				},
			],
		};
	}

	data[0].dailyData.forEach((entry) => {
		const hour = parseInt(entry.startTime.split(":")[0], 10);
		const index = Math.floor(hour / 3);

		if (filterType in entry) {
			averageRates[index] += entry[filterType];
			counts[index] += 1;
		}
	});

	averageRates = averageRates.map((total, idx) =>
		counts[idx] ? total / counts[idx] : 0
	);

	return {
		labels: defaultIntervals,
		datasets: [
			{
				label:
					filterType === "productivity"
						? "Overall Productivity "
						: "Overall Coverage Performance (%) ",
				data: averageRates,
				borderColor: "rgba(191, 160, 29, 1)",
				pointBackgroundColor: "white",
				pointBorderColor: "rgba(191, 160, 29, 1)",
				pointBorderWidth: 2,
				pointRadius: 5,
				tension: 0.9,
				fill: false,
			},
		],
	};
};
const getLineChartOptions = (filterType) => {
	return {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				title: {
					display: false,
				},
				grid: {
					display: true,
				},
				border: {
					display: false,
				},
				ticks: {
					padding: 10,
					color: "rgba(102, 112, 133, 1)",
				},
				offset: true,
				padding: {
					left: 10,
					right: 10,
				},
			},
			y: {
				beginAtZero: true,
				max: filterType.toLowerCase() === "productivity" ? 1000 : 100,
				title: {
					display: true,
					text:
						filterType.toLowerCase() === "productivity"
							? "Productivity"
							: "Avg Coverage Rates %",
					color: "rgba(152, 162, 179, 1)",
					font: {
						size: 14,
						weight: 700,
					},
				},
				border: {
					display: false,
				},
				ticks: {
					stepSize: filterType.toLowerCase() === "productivity" ? 250 : 25,
					padding: 10,
					color: "rgba(102, 112, 133, 1)",
				},
				grid: {
					display: false,
				},
			},
		},
	};
};

const DashboardView = () => {
	const { accessToken } = useAuth();
	const router = useRouter();
	const headers = { Authorization: `Bearer ${accessToken}` };
	const [botCount, setBotCount] = useState(0);
	const [siteCount, setSiteCount] = useState(0);
	const [avgCoverageRate, setAvgCoverageRate] = useState(0);
	const [issueCount, setIssueCount] = useState(0);
	const [issues, setIssues] = useState(0);
	const [activityLog, setActivityLog] = useState(0);
	const [botOverview, setBotOverview] = useState(0);
	const [barChartDataArray, setBarChartDataArray] = useState(null);
	const [lineChartDataArray, setLineChartDataArray] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [barChartFilter, setBarChartFilter] = useState("Productivity");
	const [lineChartFilter, setLineChartFilter] = useState("Productivity");
	const [filterOptions, setFilterOptions] = useState({
		performance: ["Productivity", "Coverage"],
	});

	const { getActivityLogs, loading, allActivityLog } = useActivityLog(
		(state) => ({
			loading: state?.loading,
			allActivityLog: state?.allActivityLog,
			getActivityLogs: state?.getActivityLogs,
		})
	);

	const RedirectToRobot = () => {
		router.push(`/robots`);
	};

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const botCountRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/total_robot`,
				{ headers }
			);
			const siteCountRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/total_organization`,
				{ headers }
			);
			const avgCoverageRateRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/cleaning/average_coverage_rate`,
				{ headers }
			);
			const issueCountRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/robot/issue_status`,
				{
					headers,
				}
			);
			const activityLogRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/robot/activity_log`,
				{
					headers,
				}
			);
			const botOverviewRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/robot/overview_status`,
				{
					headers,
				}
			);
			const barChartDataRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/cleaning/overall_coverage_performance_by_monthly?filterType=${barChartFilter.toLowerCase()}`,
				{ headers }
			);
			const LineChartDataRes = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/report/cleaning/coverage_performance_by_daily?filterType=${lineChartFilter.toLowerCase()}`,
				{ headers }
			);
			if (botCountRes?.status === 200) {
				const botCounts = await botCountRes?.data?.data;
				setBotCount(botCounts?.totalRobot);
			}
			if (siteCountRes?.status === 200) {
				const sitecounts = await siteCountRes?.data?.data;
				setSiteCount(sitecounts?.totalOrganization);
			}
			if (avgCoverageRateRes?.status === 200) {
				const avg = await avgCoverageRateRes?.data?.data;
				setAvgCoverageRate(avg?.cleaningReport?.overallAverageCoverageRate);
			}
			if (issueCountRes?.status === 200) {
				const issueCounts = await issueCountRes?.data?.data;
				setIssueCount(issueCounts?.issueStatus?.totalIssue);
				setIssues(issueCounts?.issueStatus?.robots);
			}
			if (activityLogRes?.status === 200) {
				const activityLogs = await activityLogRes?.data?.data;
				setActivityLog(activityLogs?.robotWithCleaningReports);
			}
			if (botOverviewRes?.status === 200) {
				const botOverviews = await botOverviewRes?.data?.data;
				setBotOverview(botOverviews?.overviewStatus?.robot);
			}
			if (barChartDataRes?.status === 200) {
				const barChartDatas = await barChartDataRes?.data?.data;
				const transformedBarData = transformData(
					barChartDatas?.cleaningReport?.overallPerformanceByMonthly,
					barChartFilter.toLowerCase()
				);
				setBarChartDataArray(transformedBarData);
			}
			if (LineChartDataRes?.status === 200) {
				const lineChartDatas = await LineChartDataRes?.data?.data;
				const transformedLineData = transformLineData(
					lineChartDatas?.cleaningReport?.performanceByDaily,
					lineChartFilter.toLowerCase()
				);
				if (transformedLineData) {
					setLineChartDataArray(transformedLineData);
				} else {
					console.error("Failed to transform line chart data");
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [barChartFilter, lineChartFilter]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		getActivityLogs();
	}, [allActivityLog]);

	if (isLoading) {
		return (
			<div className="text-black font-2x font-bold w-screen h-screen flex justify-center items-center">
				LOADING...
			</div>
		);
	}

	return (
		<Page title={"Dashboard"} noti={true}>
			<div className="flex flex-col gap-4 max-w-full px-2 md:px-5 py-2 text-black-1">
				{/* dashboard status */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatusCard
						icon={<IconBot />}
						title="Bots"
						value={botCount}
						color="bodyTextColor"
					/>
					<StatusCard
						icon={<IconSite />}
						title="Sites"
						value={siteCount}
						color="bodyTextColor"
					/>
					<StatusCard
						icon={<IconACR />}
						title="Avg Coverage Rate"
						value={`${avgCoverageRate}%`}
						color="[#0A8217]"
					/>
					<StatusCard
						icon={<IconIssue />}
						title="Issues"
						value={`0${issueCount}`}
						color="[#D7260F]"
					/>
				</div>
				{/* dashboard middle section */}
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="w-full lg:w-[30%] flex flex-col h-auto lg:max-h-[460px] gap-4">
						<div
							className="flex flex-col gap-3 rounded-[5px] bg-white px-4 py-4"
							style={{
								boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)",
							}}>
							<ViewAllHeader
								title="Bot Overview"
								padding="0"
								onViewAll={RedirectToRobot}
								viewAll={true}
							/>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col rounded-[5px] bg-[#FFF6D2] px-3 py-2">
									<div className="flex items-center justify-between">
										<span className="text-primary text-[24px] font-bold font-inter">
											Active
										</span>
										{/* <IoEyeOutline color="#004FF0" size={20} /> */}
									</div>
									<h3 className="text-bodyTextColor text-[40px] font-bold font-inter">
										{botOverview?.totalActive || 0}
									</h3>
								</div>
								<div className="flex flex-col rounded-[5px] bg-[#FFF6D2] px-3 py-2">
									<div className="flex items-center justify-between">
										<span className="text-primary text-[24px] font-bold font-inter">
											Idle
										</span>
										{/* <IoEyeOutline color="#004FF0" size={20} /> */}
									</div>
									<h3 className="text-bodyTextColor text-[40px] font-bold font-inter">
										{botOverview?.totalIdle || 0}
									</h3>
								</div>
							</div>
						</div>
						<IssuesList issues={issues} issueCount={issueCount} />
					</div>
					<div
						className="lg:w-[70%] rounded-[5px] bg-white px-4 py-4 h-[460px]"
						style={{
							boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)",
						}}>
						<div className="flex flex-col gap-2 h-full w-full">
							<span className="text-[#A18613] font-semibold text-[18px]">
								{barChartFilter === "Coverage"
									? "Overall Coverage Performance"
									: "Overall Productivity"}
							</span>
							<div>
								<div className="flex justify-end mb-3 z-50">
									<DropdownBtn
										options={filterOptions.performance}
										onChange={(value) => setBarChartFilter(value)}
										selectedItem={barChartFilter}
									/>
								</div>
								<div className="w-full min-h-[350px] m-0">
									<Bar
										data={barChartDataArray}
										options={getBarChartOptions(barChartFilter)}
										plugins={[remainingLinePlugin]}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* dashboard last section */}
				<div className="flex flex-col lg:flex-row gap-4">
					<div
						className="lg:w-[70%] rounded-[5px] bg-white px-4 py-4 h-[460px]"
						style={{
							boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)",
						}}>
						<div className="flex flex-col gap-2 h-full w-full">
							<span className="text-[#A18613] font-semibold text-[18px]">
								{lineChartFilter === "Coverage"
									? "Coverage Performance (Daily)"
									: "Productivity (Daily)"}
							</span>
							<div>
								<div className="flex justify-end mb-3 z-50">
									<DropdownBtn
										options={filterOptions.performance}
										onChange={(value) => setLineChartFilter(value)}
										selectedItem={lineChartFilter}
									/>
								</div>
								<div className="w-full min-h-[350px] m-0">
									<Line
										data={lineChartDataArray}
										options={getLineChartOptions(lineChartFilter)}
									/>
								</div>
							</div>
						</div>
					</div>
					<div
						className="lg:w-[30%] h-[460px] relative z-10"
						style={{
							boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)",
						}}>
						<ActivityLog activityLog={allActivityLog} />
					</div>
				</div>
			</div>
		</Page>
	);
};

export default DashboardView;
