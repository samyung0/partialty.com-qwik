import { component$, useVisibleTask$ } from "@builder.io/qwik";
import ApexCharts from "apexcharts";
import { Correctness } from "./statistics/correctness";
import { HourPerDay } from "./statistics/hourPerDay";

const chartElementId = "area-chart";
const options = {
  chart: {
    height: "100%",
    maxWidth: "100%",
    type: "line",
    fontFamily: "Inter, sans-serif",
    dropShadow: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 6,
    curve: "smooth",
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -26,
    },
  },
  series: [
    {
      name: "Clicks",
      data: [6500, 6418, 6456, 6526, 6356, 6456],
      color: "#1A56DB",
    },
    {
      name: "CPC",
      data: [6456, 6356, 6526, 6332, 6418, 6500],
      color: "#7E3AF2",
    },
  ],
  legend: {
    show: false,
  },
  xaxis: {
    categories: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb", "07 Feb"],
    labels: {
      show: true,
      style: {
        fontFamily: "Inter, sans-serif",
        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
};

export default component$(() => {
  // const formData = useStore({
  //   nickname: user.nickname,
  // });

  useVisibleTask$(() => {
    const chartElement = document.getElementById(chartElementId);
    if (chartElement && typeof ApexCharts != "undefined") {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  });

  return (
    <div class="mx-auto flex w-[80%] flex-col ">
      <p class="text-2xl font-bold">Statistics</p>
      <div class="mt-3 w-full border-t border-black"></div>
      <div class="mt-3 flex flex-col gap-9 pt-12">
        <div class="flex h-[340px] gap-4 ">
          <HourPerDay />
          <Correctness />
        </div>
      </div>
    </div>
  );
});
