import React from 'react';
import Highcharts from 'highcharts';
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
            const yAxisPoint = value.OpenAsk;
            const xAxisPoint = (new Date(value.Time)).getTime();
            const axisPoint = [xAxisPoint, yAxisPoint];
            this.chartAxisPoints.push(axisPoint);
        });

        this.chart = Highcharts.chart(this.props.chartId, {
            chart: {
                type: HIGH_CHART_CONFIG.CHART_TYPE,
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: HIGH_CHART_CONFIG.MARGIN_RIGHT,
            },
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
                    value: 0,
                    color: 'green',
                    dashStyle: 'shortdash',
                    width: 2,
                    zIndex: 9,
                    label: { text: '0' },
                }],
            },
            ],
            series: [{
                name: HIGH_CHART_CONFIG.SERIES_NAME,
                data: this.chartAxisPoints,
            }],
        });
    }

    handleChartUpdate(data) {
        _.forEach(data, (value) => {
            const index = _.findIndex(this.chartData, ['Time', value.Time]);
            const series = this.chart.series[0];
            if (index >= 0) {
                const plotLines = series.yAxis.options.plotLines[0];
                this.chartData[index] = value;
                series.data[this.chartData.length - 1].y = value.CloseAsk;
                plotLines.value = value.CloseAsk;
                plotLines.label.text = value.CloseAsk;
                series.yAxis.update();
            } else {
                const lastChartData = this.chartData[this.chartData.length - 1];
                const yAxisPoint = lastChartData.CloseAsk;
                const xAxisPoint = (new Date(lastChartData.Time)).getTime();
                series.addPoint([xAxisPoint, yAxisPoint], true, true);
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
