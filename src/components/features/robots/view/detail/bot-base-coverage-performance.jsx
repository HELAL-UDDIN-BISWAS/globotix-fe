import React, { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import chroma from "chroma-js";
import axios from "axios";
import { API_URL } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { MdKeyboardArrowDown } from "react-icons/md";

const DropdownBtn = ({
  options = [],
  onChange = () => {},
  selectedItem = "",
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex grow-0 gap-1 items-center justify-end min-w-24 focus:outline-none border-none text-xs font-semibold text-secondaryFontColor">
          {selectedItem}
          <MdKeyboardArrowDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-none p-0 text-secondaryFontColor ">
        {options?.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onChange(item)}
            className="hover:bg-primary border-b border-gray hover:text-white flex align-center gap-[12px] px-4 py-[12px]"
          >
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

const getChartOptions = (filter) => {
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "start",
        labels: {
          usePointStyle: true,
        },
        onHover: function (event, legendItem, legend) {
          event.native.target.style.cursor = "pointer";
        },
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
        max: 100,
        title: {
          display: true,
          text:
            filter.performance === "Coverage"
              ? "Avg Coverage Rates %"
              : "Avg Productivity Rates %",
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
          stepSize: 25,
          padding: 10,
          color: "rgba(102, 112, 133, 1)",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return lineChartOptions;
};

const generateUniqueRandomColors = (array) => {
  const usedColors = new Set();
  const targetColor = chroma("#BFA01D");
  const targetHue = targetColor.get("hsl.h");
  const targetSaturation = targetColor.get("hsl.s");
  const targetLightness = targetColor.get("hsl.l");
  const colorStep = 360 / array.length; // Divide the color wheel by the number of items to ensure difference
  let hueDifference,
    saturationDifference,
    lightnessDifference,
    generatedColor = null;

  return array.map((item, index) => {
    let color;
    do {
      const hue = (index * colorStep + (Math.random() * colorStep) / 2) % 360;
      color = chroma
        .hsl(
          hue, // Spread hues evenly around the color wheel
          0.8 + Math.random() * 0.2, // High saturation
          0.4 + Math.random() * 0.3 // Lightness for vibrant colors
        )
        .hex();

      generatedColor = chroma(color);
      hueDifference = Math.abs(generatedColor.get("hsl.h") - targetHue);
      saturationDifference = Math.abs(
        generatedColor.get("hsl.s") - targetSaturation
      );
      lightnessDifference = Math.abs(
        generatedColor.get("hsl.l") - targetLightness
      );
    } while (
      usedColors.has(color) ||
      (hueDifference < 10 &&
        saturationDifference < 0.1 &&
        lightnessDifference < 0.1) || // Avoid colors similar to '#BFA01D'
      (generatedColor.get("hsl.h") >= 50 && generatedColor.get("hsl.h") <= 65) // Avoid yellow-related hues
    );

    usedColors.add(color);
    return {
      ...item,
      color,
    };
  });
};

const formatDate = (inputDate) => {
  return dayjs(inputDate).format("YYYY-MM-DD");
};

const fetchData = async ({ robotId, minDate, maxDate, zoneName, type }) => {
  let authLocal = JSON.parse(localStorage.getItem("authSession"));
  let token =
    authLocal && authLocal.state && authLocal.state.accessToken
      ? authLocal.state.accessToken
      : "";

  const requestOptions = {
    robotId: robotId,
    startDatetime: formatDate(minDate),
    endDatetime: formatDate(maxDate),
    zoneName,
    type: type.toLowerCase(),
  };

  try {
    const response = await axios({
      method: "POST",
      url:
        API_URL +
        "/api/report/robot_coverage_productivity_by_zone_within_time_range",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: requestOptions,
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error fetching reports: ", error);
  }
  return [];
};

const getDateRange = () => {
  const today = new Date();
  const lastMonthDate = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
    today.getHours(),
    today.getMinutes(),
    today.getSeconds(),
    today.getMilliseconds()
  );

  return {
    today: dayjs(today).format("YYYY-MM-DDTHH:mm:ssZ"),
    lastMonthDate: dayjs(lastMonthDate).format("YYYY-MM-DDTHH:mm:ssZ"),
  };
};

const prepareChartData = (zoneData = [], type = "") => {
  const datasetType = type.toLowerCase();
  const coloredZones = generateUniqueRandomColors(zoneData);
  const labels = zoneData?.[0]?.performance?.map((e) => e?.date);
  const datasets = coloredZones?.map((e) => ({
    label: e?.zoneName,
    data: e?.performance?.map((e) => e[datasetType]),
    borderColor: e.color,
    backgroundColor: e.color,
    pointRadius: 0,
  }));

  return { labels, datasets };
};

const BotBaseCoveragePerformance = ({
  filterOptions,
  setFilterOptions,
  filters,
  setFilters,
}) => {
  const params = useParams();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const getData = useCallback(async () => {
    const { lastMonthDate: minDate, today: maxDate } = getDateRange();
    const filter = {
      robotId: params.robotId,
      minDate,
      maxDate,
      zoneName: filters.zone === "All Zone" ? "*" : filters.zone,
      type: filters.performance,
    };
    const response = await fetchData(filter);
    setFilterOptions((prev) => ({
      ...prev,
      zone: ["All Zone"].concat(response?.zoneList),
    }));
    const resChartData = prepareChartData(
      response?.zoneData,
      filters.performance
    );
    setChartData(resChartData);
  }, [params.robotId, filters]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <div className="flex gap-3 items-center justify-end">
        <DropdownBtn
          options={filterOptions.zone}
          selectedItem={filters.zone}
          onChange={(value) => setFilters((prev) => ({ ...prev, zone: value }))}
        />
        <DropdownBtn
          options={filterOptions.performance}
          selectedItem={filters.performance}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, performance: value }))
          }
        />
      </div>
      <div className="grow w-[100%] margin-0">
        <Line data={chartData} options={getChartOptions(filters)} />
      </div>
    </>
  );
};

export default BotBaseCoveragePerformance;
