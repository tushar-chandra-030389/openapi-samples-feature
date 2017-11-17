import React from 'react';
import Highcharts from 'highcharts/highstock';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { string, array } from 'prop-types';
import { HIGH_CHART_CONFIG } from 'src/js/utils/constants';

class HighCharts extends React.PureComponent {
    constructor(props) {
        super(props);
        this.chartData = props.chartData;
        this.chartAxisPoints = [];
        this.chart = null;
    }

    componentDidMount() {
        this.initializeChart();
    }

    componentWillReceiveProps(nextProps) {
        this.handleChartUpdate(nextProps.chartData);
    }

    initializeChart() {
        _.forEach(this.chartData, (value) => {
            const yAxisOpenAsk = value.OpenAsk;
            const yAxisHighAsk = value.HighAsk;
            const yAxisLowAsk = value.LowAsk;
            const yAxisCloseAsk = value.CloseAsk;
            const xAxisPoint = (new Date(value.Time)).getTime();
            const axisPoint = [xAxisPoint, yAxisOpenAsk, yAxisHighAsk, yAxisLowAsk, yAxisCloseAsk];
            this.chartAxisPoints.push(axisPoint);
        });

        this.chart = Highcharts.stockChart(this.props.chartId, {
            title: {
                text: HIGH_CHART_CONFIG.TITLE_TEXT,
            },
            xAxis: {
                title: {
                    text: HIGH_CHART_CONFIG.XAXIS_TITLE,
                },
                type: HIGH_CHART_CONFIG.XAXIS_TYPE,
            },
            yAxis: [{
                title: {
                    text: HIGH_CHART_CONFIG.YAXIS_TITLE,
                },
                plotLines: [{
                    value: HIGH_CHART_CONFIG.PLOTLINE_VALUE,
                    color: HIGH_CHART_CONFIG.PLOTLINE_COLOR,
                    dashStyle: HIGH_CHART_CONFIG.PLOTLINE_DASHSTYLE,
                    width: HIGH_CHART_CONFIG.PLOTLINE_WIDTH,
                    zIndex: HIGH_CHART_CONFIG.PLOTLINE_ZINDEX,
                    label: { text: HIGH_CHART_CONFIG.PLOTLINE_LABEL_TEXT },
                }],
            },
            ],
            plotOptions: {
                candlestick: {
                    color: HIGH_CHART_CONFIG.CHART_DOWN_COLOR,
                    upColor: HIGH_CHART_CONFIG.CHART_UP_COLOR,
                },
            },
            series: [{
                type: HIGH_CHART_CONFIG.CHART_TYPE,
                name: HIGH_CHART_CONFIG.SERIES_NAME,
                data: this.chartAxisPoints,
            }],

        });
    }

    handleChartUpdate(data) {
        const series = this.chart.series[0];
        const plotLines = series.yAxis.options.plotLines[0];
        _.forEach(data, (value) => {
            const index = _.findIndex(this.chartData, ['Time', value.Time]);
            if (index >= 0) {
                this.chartData[index] = value;
                series.yData[this.chartData.length - 1][0] = value.OpenAsk;
                series.yData[this.chartData.length - 1][1] = value.HighAsk;
                series.yData[this.chartData.length - 1][2] = value.LowAsk;
                series.yData[this.chartData.length - 1][3] = value.CloseAsk;
                plotLines.value = value.OpenAsk;
                plotLines.label.text = value.OpenAsk + ' (OpenAsk)';
                series.yAxis.update();
            } else {
                const lastChartData = this.chartData[this.chartData.length - 1];
                const yAxisOpenAsk = lastChartData.OpenAsk;
                const yAxisHighAsk = lastChartData.HighAsk;
                const yAxisLowAsk = lastChartData.LowAsk;
                const yAxisCloseAsk = lastChartData.CloseAsk;
                const xAxisPoint = (new Date(lastChartData.Time)).getTime();
                series.addPoint([xAxisPoint, yAxisOpenAsk, yAxisHighAsk, yAxisLowAsk, yAxisCloseAsk], true, true);
                this.chartData[this.chartData.length - 1] = value;
            }
        });
    }

    render() {
        return (
            <div id={this.props.chartId}>
            </div>
        );
    }
}

HighCharts.propTypes = {
    chartId: string.isRequired,
    chartAxisPoints: array,
    chartData: array.isRequired,
};

export default bindHandlers(HighCharts);
