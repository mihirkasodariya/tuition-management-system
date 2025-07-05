import { memo, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = ['#4A90E2', '#E94E77'];

const AdminGenderGraph = ({ data = null }) => {
  const options = {
    align: 'center',
    chart: {
      height: 200,
      type: 'donut',
      align: 'center',
    },
    labels: ['Male', 'Female'],
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      show: true,
    },
    title: {
      text: 'Total Students',
    },
    colors,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
            },
          },
        },
      },
    },
  };

  const series = data && data?.map((item) => item.count);

  return (
    <ReactApexChart options={options} series={(data && series) || []} type="donut" width={420} />
  );
};

export default memo(AdminGenderGraph);
