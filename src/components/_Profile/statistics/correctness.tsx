import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { ApexOptions } from 'apexcharts';
import ApexCharts from 'apexcharts';

const chartElementId = 'correctness';
const options: ApexOptions = {
  series: [17, 7],
  colors: ['#6fdcbf', '#ff6347'],
  chart: {
    offsetY: -10,
    height: 200,
    width: '100%',
    type: 'pie',
  },

  plotOptions: {
    pie: {
      dataLabels: {
        offset: -15,
      },
    },
  },
  labels: ['Correct', 'Wrong'],
  // dataLabels: {
  //   enabled: true,
  //   style: {
  //     fontFamily: "Inter, sans-serif",
  //   },
  // },
  legend: {
    position: 'bottom',
    fontFamily: "'Varela_Round'",
    fontWeight: 500,
    offsetY: 7,
  },

  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
};

export const Correctness = component$(() => {
  useVisibleTask$(() => {
    const chartElement = document.getElementById(chartElementId);
    if (chartElement && typeof ApexCharts != 'undefined') {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  });

  return (
    <div class=" w-[300px]   rounded-xl border-2 border-black bg-white px-12 py-8 shadow-lg">
      <div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div class="flex items-center">
          <div>
            <h5 class="pb-1 text-2xl font-bold leading-none text-gray-900 ">24 Tasks</h5>
            <p class="text-sm font-normal text-gray-500 dark:text-gray-400">completed last week</p>
          </div>
        </div>
      </div>
      <div class="py-6" id={chartElementId}></div>
    </div>
  );
});
