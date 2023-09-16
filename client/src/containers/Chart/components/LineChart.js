import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useTheme } from "@nextui-org/react";

import KpiChartSegment from "./KpiChartSegment";
import ChartErrorBoundary from "./ChartErrorBoundary";
import KpiMode from "./KpiMode";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const dataLabelsPlugin = {
  font: {
    weight: "bold",
    size: 10,
    family: "Inter",
  },
  padding: 4,
  backgroundColor(context) {
    if (context.dataset.backgroundColor === "transparent"
      || context.dataset.backgroundColor === "rgba(0,0,0,0)"
    ) {
      return context.dataset.borderColor;
    }
    return context.dataset.backgroundColor;
  },
  borderRadius: 4,
  color: "white",
  formatter: Math.round,
};

function LineChart(props) {
  const {
    chart, redraw, redrawComplete, height, editMode,
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
      if (newOptions.scales?.y?.grid) {
        newOptions.scales.y.grid.color = theme.colors.accents5.value;
      }
      if (newOptions.scales?.x?.grid) {
        newOptions.scales.x.grid.color = theme.colors.accents5.value;
      }
      if (newOptions.scales?.y?.ticks) {
        newOptions.scales.y.ticks.color = theme.colors.accents9.value;
      }
      if (newOptions.scales?.x?.ticks) {
        newOptions.scales.x.ticks.color = theme.colors.accents9.value;
      }
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = theme.colors.accents9.value;
      }
      return newOptions;
    }

    return chart.chartData?.options;
  };

  return (
    <>
      {chart.mode === "kpi"
        && chart.chartData
        && chart.chartData.data
        && chart.chartData.data.datasets
        && (
          <KpiMode chart={chart} />
        )}

      {chart.mode !== "kpi" && chart.chartData && chart.chartData.data && (
        <div className={chart.mode === "kpi" && "chart-kpi"}>
          {chart.chartData.growth && chart.mode === "kpichart" && (
            <KpiChartSegment chart={chart} editMode={editMode} />
          )}
          {chart.chartData.data && chart.chartData.data.labels && (
            <div>
              <ChartErrorBoundary>
                <Line
                  data={chart.chartData.data}
                  options={{
                    ..._getChartOptions(),
                    plugins: {
                      ..._getChartOptions().plugins,
                      datalabels: chart.dataLabels && dataLabelsPlugin,
                    },
                  }}
                  height={
                    height - (
                      (chart.mode === "kpichart" && chart.chartSize > 1 && 80)
                      || (chart.mode === "kpichart" && chart.chartSize === 1 && 74)
                      || 10
                    )
                  }
                  redraw={redraw}
                  plugins={chart.dataLabels ? [ChartDataLabels] : []}
                />
              </ChartErrorBoundary>
            </div>
          )}
        </div>
      )}
    </>
  );
}

LineChart.defaultProps = {
  redraw: false,
  redrawComplete: () => {},
  height: 300,
  editMode: false,
};

LineChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  height: PropTypes.number,
  editMode: PropTypes.bool,
};

export default LineChart;
