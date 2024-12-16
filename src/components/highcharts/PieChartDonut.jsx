import React, { useCallback, useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = (departmentChartData) => {
  const [departmentsChartData, setDepartmentChartData] = useState([]);

  if (
    departmentChartData.departmentChartData.data !== undefined
  ) {
    let seriesData = [];

    Object.entries(
      departmentChartData.departmentChartData.data.teamworks
    ).forEach(([key, value]) => {
      seriesData.push({
        name:
          value.user.honorific +
          " " +
          value.user.first_name +
          " " +
          value.user.middle_name +
          " " +
          value.user.last_name,
        y: value.time_in_minutes,
        time: value.time_spent,
        estimation_value: value.estimation_value,
        estimation_type: value.estimation_type,
      });
    });

    setDepartmentChartData({
      chart: {
        type: "pie",
        width: 600,
        height: 600,

        // events: {
        //   load: function () {
        //     var chart = this;
        //     var totalValue = point.estimation_value;
        //     chart.setTitle({
        //       text: "Department Estimation - " + totalValue
        //     });
        //   }
        // }
      },
      title: {
        text: "Department Estimation",
        align: "left",
      },
      // subtitle: {
      //   text: "Total allocated to complete the teamworks.",
      //   align: "left",
      // },
      tooltip: {
        pointFormat:
          "<b>Total Time: {point.time}</b> ({point.percentage:.2f}%)",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
          name: "Hours",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: "pointer",
          innerSize: "50%",
          borderRadius: 10,
          dataLabels: {
            enabled: true,
            format:
              "<b>{point.name}</b><br>Time: {point.time} ({point.percentage:.2f}%)",
            distance: 20,
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: "pie",
          data: seriesData,
        },
      ],
    });

  }

  return (
    <React.Fragment>
      <HighchartsReact highcharts={Highcharts} options={departmentsChartData} />
    </React.Fragment>
  );
};

export default PieChart;
