import React, { memo } from 'react';
import ReactApexChart from 'react-apexcharts';

const AttendanceGraph = ({ attendanceData = null }) => {
  // Format data
  const seriesData = attendanceData?.map((record) => ({
    x: new Date(record?.startDate),
    y: record?.isPresent ? 1 : 0,
  }));

  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    title: {
      text: 'Student Attendance Over Time',
      align: 'center',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#4CAF50', // Present
            opacity: 0.8,
          },
          {
            offset: 100,
            color: '#F44336', // Absent
            opacity: 0.8,
          },
        ],
      },
    },
    markers: {
      size: 4,
      colors: seriesData?.map((d) => (d.y === 1 ? '#4CAF50' : '#F44336')),
      strokeWidth: 0,
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const record = attendanceData[dataPointIndex];
        return `<div class="arrow-box tooltip">
                <table style="padding: 8px; background: #fff; border: 1px solid #ccc;">
                  <tr><td><strong>Date:</strong></td><td>${new Date(
                    record.startDate
                  ).toLocaleString()}</td></tr>
                  <tr><td><strong>Status:</strong></td><td>${
                    record.isPresent ? 'Present' : 'Absent'
                  }</td></tr>
                </table>
              </div>`;
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'MMM dd, yyyy HH:mm',
      },
    },
    yaxis: {
      tickAmount: 1,
      labels: {
        formatter: (val) => (val === 1 ? 'Present' : val === 0 ? 'Absent' : ''),
      },
    },
    grid: {
      borderColor: '#e7e7e7',
    },
  };

  return (
    <div>
      <ReactApexChart
        options={{
          ...options,
          series: [
            {
              name: 'Attendance',
              data: seriesData,
            },
          ],
        }}
        series={[
          {
            data: seriesData,
          },
        ]}
        type="area"
        height={350}
      />
    </div>
  );
};

export default memo(AttendanceGraph);
