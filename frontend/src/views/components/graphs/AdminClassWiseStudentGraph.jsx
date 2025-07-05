import React, { memo } from 'react';
import ReactApexChart from 'react-apexcharts';
import _ from 'lodash';
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

const classrooms = Array.from({ length: 12 }, (_, i) => i + 1);
const AdminClassWiseStudentGraph = ({ data }) => {
  //   const categories = data && data?.map((item) => item?.classRoom) || [];
  const categories = _.cloneDeep(classrooms);
  const seriesData =
    (data &&
      classrooms?.map((item) => {
        let current = _.find(data, { classRoom: item });
        if (current) return current.count;
        else return 0;
      })) ||
    [];

  // Chart options
  const chartOptions = {
    chart: {
      type: 'bar',
    },

    xaxis: {
      categories,
      title: {
        text: 'Class Rooms',
      },
    },

    yaxis: {
      title: {
        text: 'No. of. Students',
      },
    },

    title: {
      text: 'Class Wise Students',
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
        horizontal: false,
        distributed: true,
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

  const series = [
    {
      name: 'Total Students',
      data: seriesData,
    },
  ];
  return (
    <div>
      {' '}
      <ReactApexChart options={chartOptions} series={series} type="bar" />
    </div>
  );
};

export default memo(AdminClassWiseStudentGraph);
