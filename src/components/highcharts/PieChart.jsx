import React, { useCallback, useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = (projectChartData) => {


  const [clientChartData, setClientChartData] = useState([]);

  if (
    projectChartData.projectChartData &&
    projectChartData.projectChartData.project
  ) {

    let project     = projectChartData.projectChartData.project;
    let seriesData  = [];

    projectChartData.projectChartData.project.departments.map((department) => {
      seriesData.push({
        name: department.department.name,
        y: department.estimation_value,
        type: department.estimation_type,
      });
    });

    let estimation_type = "";
    if(project.estimation_type != null) {
      estimation_type = project.estimation_type.charAt(0).toUpperCase() + project.estimation_type.slice(1);
    }

    let estimation_value = "";
    if(project.estimation_value != null) {
      estimation_value = " - " + project.estimation_value;
    }

    setClientChartData({
      chart: {
        type: "pie",
        width: 600, // Adjust the width of the chart
        height: 600, // Adjust the height of the chart
      },
      title: {
        text: `Project Estimation ${estimation_value + " " + estimation_type}`,
        align: "left",
      },
      // subtitle: {
      //   text: `Total ${project.estimation_type} allocated to complete the Project.`,
      //   align: "left",
      // },
      tooltip: {
        pointFormat: "<b>{point.y} {point.type}</b> ({point.percentage:.2f}%)",
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
          // innerSize: "50%",
          borderRadius: 4,
          dataLabels: {
            enabled: true,
            format:
              "<b>{point.name}</b><br>{point.y} {point.type} ({point.percentage:.2f}%)",
            distance: 20,
          },
        },
      },
      credits: {
        enabled: false,
      },
      // legend: {
      //   enabled: true,
      //   layout: 'vertical',
      //   align: 'right',
      //   verticalAlign: 'middle',
      // },
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
      <HighchartsReact highcharts={Highcharts} options={clientChartData} />
    </React.Fragment>
  );
};

export default PieChart;
