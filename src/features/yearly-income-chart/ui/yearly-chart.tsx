import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { type InvoiceListModel } from '~/entities/invoice/model/invoice.model';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement
);


export const YearlyChart: React.FC<{ invoices: InvoiceListModel[] }> = React.memo(({ invoices }) => {
  const currentYear = new Date().getFullYear();
  const currentYearInvoices = invoices.filter(invoice => new Date(invoice.dueDate ?? '').getFullYear() === currentYear);
  const monthlyData = Array(12).fill(0);

  currentYearInvoices.forEach(invoice => {
    const invoiceDate = new Date(invoice.dueDate ?? '');
    const month = invoiceDate.getMonth();
    monthlyData[month] += invoice.totalNetPrice;
  });

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Income',
        data: monthlyData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Yearly Income by Month (${currentYear})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Income',
        },
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Bar options={chartOptions} data={chartData} />;
});

YearlyChart.displayName = 'YearlyChart';