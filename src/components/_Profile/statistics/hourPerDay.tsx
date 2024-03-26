import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { ApexOptions } from 'apexcharts';
import ApexCharts from 'apexcharts';

const chartElementId = 'hour-per-day';
const options: ApexOptions = {
  colors: ['#1A56DB', '#FDBA8C'],
  series: [
    {
      name: 'Hours of studying',
      color: '#72cada',
      data: [
        { x: 'Mon', y: 7 },
        { x: 'Tue', y: 3 },
        { x: 'Wed', y: 1 },
        { x: 'Thu', y: 2 },
        { x: 'Fri', y: 5 },
        { x: 'Sat', y: 6 },
        { x: 'Sun', y: 8 },
      ],
    },
  ],
  chart: {
    type: 'bar',
    height: '175px',
    fontFamily: 'mosk',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadiusApplication: 'end',
      borderRadius: 4,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    style: {
      fontFamily: 'Varela_Round',
    },
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 1,
      },
    },
  },
  stroke: {
    show: true,
    width: 0,
    colors: ['transparent'],
  },
  grid: {
    show: true,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    floating: false,
    labels: {
      show: true,
      style: {
        fontFamily: 'Inter, sans-serif',
        cssClass: 'font-bold text-sm',
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
  fill: {
    opacity: 1,
  },
};

export const HourPerDay = component$(() => {
  useVisibleTask$(() => {
    const chartElement = document.getElementById(chartElementId);
    if (chartElement && typeof ApexCharts != 'undefined') {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  });

  return (
    <div class=" overflow-auto rounded-xl border-2 border-black bg-white px-12 py-8 shadow-lg">
      <div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div class="flex items-center">
          <div>
            <h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 ">24 Hours</h5>
            <p class="text-sm font-normal text-gray-500 dark:text-gray-400">spent on studying last week</p>
          </div>
        </div>
        <div>
          <span class="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            <svg
              class="me-1.5 h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"
              />
            </svg>
            32.3%
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <dl class="flex items-center">
          <dt class="me-1 text-sm font-normal text-gray-500 dark:text-gray-400">Avg. per day:</dt>
          <dd class="text-sm font-semibold text-gray-900 dark:text-white">3.5 Hours</dd>
        </dl>
      </div>

      <div id={chartElementId} class="w-[500px] min-w-[500px] font-mosk"></div>
    </div>
  );
});
