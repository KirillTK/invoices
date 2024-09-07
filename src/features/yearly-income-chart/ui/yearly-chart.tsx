import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Yearly Income by Month',
    },
  },
};

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Income',
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3800, 3200, 4100, 2800, 1500],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};


const YearlyChart: React.FC = () => {
  return <Bar options={chartOptions} data={chartData} />;
};

export default YearlyChart;