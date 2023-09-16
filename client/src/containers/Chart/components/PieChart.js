import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { useTheme } from "@nextui-org/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartErrorBoundary from "./ChartErrorBoundary";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const dataLabelsPlugin = {
  font: {
    weight: "bold",
    size: 12,
    family: "Inter",
  },
  padding: 4,
  formatter: (value, context) => {
    let formattedValue = value;
    try {
      formattedValue = parseFloat(value);
    } catch (e) {
      // do nothing
    }

    const hiddens = context.chart._hiddenIndices;
    let total = 0;
    const datapoints = context.dataset.data;
    datapoints.forEach((val, i) => {
      let formattedVal = val;
      try {
        formattedVal = parseFloat(val);
      } catch (e) {
        // do nothing
      }

      if (hiddens[i] !== undefined) {
        if (!hiddens[i]) {
          total += formattedVal;
        }
      } else {
        total += formattedVal;
      }
    });
    const percentage = `${((formattedValue / total) * 100).toFixed(2)}%`;
    const out = percentage;
    return out;
  },
  display(context) {
    const { dataset } = context;
    const count = dataset.data.length;
    const value = dataset.data[context.dataIndex];
    return value > count * 1.5;
  },
  backgroundColor(context) {
    return context.dataset.backgroundColor;
  },
  borderColor: "white",
  borderRadius: 6,
  borderWidth: 2,
};

function PieChart(props) {
  const {
    chart, redraw, redrawComplete, height
  } = props;

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw]);

  const { theme } = useTheme();

  const _getChartOptions = () => {
    // add any dynamic changes to the chartJS options here
    if (chart.chartData?.options) {
      const newOptions = { ...chart.chartData.options };
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = theme.colors.accents9.value;
      }
      return newOptions;
    }

    return chart.chartData?.options;
  };

  return (
    <div>
      {chart.chartData.data && chart.chartData.data.labels && (
        <ChartErrorBoundary>
          <Pie
            data={chart.chartData.data}
            options={{
              ..._getChartOptions(),
              plugins: {
                ..._getChartOptions().plugins,
                datalabels: dataLabelsPlugin,
              },
            }}
            height={height - 10}
            redraw={redraw}
            plugins={[ChartDataLabels]}
          />
        </ChartErrorBoundary>
      )}
    </div>
  );
}

PieChart.defaultProps = {
  redraw: false,
  redrawComplete: () => { },
  height: 300,
};

PieChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
};

export default PieChart;
