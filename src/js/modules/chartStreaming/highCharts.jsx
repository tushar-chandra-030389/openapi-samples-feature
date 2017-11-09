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
            const yAxisCloseAsk = value.CloseAsk;
            const yAxisCloseBid = value.CloseBid;
            const yAxisHighAsk = value.HighAsk;

            const xAxisPoint = (new Date(value.Time)).getTime();
            const axisPoint = [xAxisPoint, yAxisOpenAsk, yAxisCloseAsk, yAxisCloseBid, yAxisHighAsk];
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
            series: [{
                type: HIGH_CHART_CONFIG.CHART_TYPE,
                name: HIGH_CHART_CONFIG.SERIES_NAME,
                data: this.chartAxisPoints,
            }],

            plotOptions: {
                candlestick: {
                    downColor: 'red',
                    upColor: 'silver',
                },
            },
        });
    }

    handleChartUpdate(data) {
        _.forEach(data, (value) => {
            const index = _.findIndex(this.chartData, ['Time', value.Time]);
            const series = this.chart.series[0];
            if (index >= 0) {
                const plotLines = series.yAxis.options.plotLines[0];
                this.chartData[index] = value;
                series.yData[this.chartData.length - 1][0] = value.OpenAsk;
                series.yData[this.chartData.length - 1][1] = value.CloseAsk;
                series.yData[this.chartData.length - 1][2] = value.CloseBid;
                series.yData[this.chartData.length - 1][3] = value.HighAsk;
                plotLines.value = value.CloseAsk;
                plotLines.label.text = value.CloseAsk;
                series.yAxis.update();
            } else {
                const lastChartData = this.chartData[this.chartData.length - 1];
                const yAxisOpenAsk = lastChartData.OpenAsk;
                const yAxisCloseAsk = lastChartData.CloseAsk;
                const yAxisCloseBid = lastChartData.CloseBid;
                const yAxisHighAsk = lastChartData.HighAsk;
                const xAxisPoint = (new Date(lastChartData.Time)).getTime();
                series.addPoint([xAxisPoint, yAxisOpenAsk, yAxisCloseAsk, yAxisCloseBid, yAxisHighAsk], true, true);
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
