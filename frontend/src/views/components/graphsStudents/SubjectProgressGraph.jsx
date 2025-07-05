import React, { memo } from 'react';
import ReactApexChart from 'react-apexcharts';

const colors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33A1',
  '#A133FF',
  '#33FFF5',
  '#F5FF33',
  '#FF8C33',
  '#33FF8C',
  '#8C33FF',
  '#FF3333',
  '#33FF33',
];

const SubjectProgressGraph = ({ subjectsProgress = null }) => {
  const series = [
    {
      data: subjectsProgress?.map((s) => s.progress),
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 300,
    },

    xaxis: {
      categories: subjectsProgress?.map((s) => s.subjectName),
      position: 'bottom',
    },

    yaxis: {
      labels: {
        formatter: (val) => `${val}%`,
      },
    },

    title: {
      text: 'Subject-wise Progress',
      align: 'center',
    },

    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
        distributed: true,
      },
    },

    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      offsetY: 20,
    },

    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 10,
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <ReactApexChart options={options} series={series || []} type="bar" height={300} />
    </div>
  );
};

export default memo(SubjectProgressGraph);
