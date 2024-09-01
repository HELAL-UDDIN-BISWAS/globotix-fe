import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
import useRobots from "@/hooks/useRobots";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

function getMonthName(monthNumber) {
  return dayjs()
    .month(parseInt(monthNumber, 10) - 1)
    .format("MMM");
}

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
    chart.data.datasets[0].data.forEach((value, index) => {
      const xPosition = x.getPixelForValue(index);
      const yPosition = y.getPixelForValue(value);
      ctx.save();
      ctx.strokeStyle = "rgba(208, 213, 221, 1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xPosition, yPosition);
      ctx.lineTo(xPosition, y.getPixelForValue(100));
      ctx.stroke();
      ctx.restore();
    });
  },
};

const barChartData = {
  labels: [],
  datasets: [
    {
      label: "Issues",
      data: [],
      backgroundColor: "rgba(191, 160, 29, 1)",
      barThickness: 15,
    },
  ],
};

const barChartOptions = {
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
      },
    },
    y: {
      beginAtZero: true,
      max: 10,
      title: {
        display: true,
        text: "Issues",
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
        stepSize: 5,
        padding: 10,
      },
      grid: {
        display: false,
      },
    },
  },
};

const BotBaseIssueFaced = () => {
  const params = useParams();
  const { getMonthlyIssueFaced, issueFacedMonthly } = useRobots();
  const [chartData, setChartData] = useState(barChartData);

  const fetchData = async () => {
    await getMonthlyIssueFaced({ robotId: params.robotId });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      labels: issueFacedMonthly?.map((e, index) => getMonthName(e?.month)),
      datasets: [
        {
          ...prevData.datasets[0],
          data: issueFacedMonthly?.map((e, index) => e?.totalIssues),
        },
      ],
    }));
  }, [issueFacedMonthly]);

  return (
    <div style={{ width: "100%", height: "100%", margin: "auto" }}>
      <Bar
        data={chartData}
        options={barChartOptions}
        plugins={[remainingLinePlugin]}
      />
    </div>
  );
};

export default BotBaseIssueFaced;
