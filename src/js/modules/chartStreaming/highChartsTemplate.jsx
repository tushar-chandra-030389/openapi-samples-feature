import React from 'react';
import Highcharts from 'highcharts';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { string, array } from 'prop-types';
import * as constants from 'src/js/data/highchartConstant.json';

class HighChartsTemplate extends React.PureComponent {
    constructor(props) {
        super(props);
        this.chartData = props.chartData;
        this.ChartAxisPoints = [];
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
            this.ChartAxisPoints.push(axisPoint);
        });

        this.chart = Highcharts.chart(this.props.chartId, {
            chart: {
                type: constants.chartType,
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: constants.marginRight,
            },
            title: {
                text: constants.titleText,
            },
            xAxis: {
                title: {
                    text: constants.xAxisTitle,
                },
                type: constants.xAxisType,
            },
            yAxis: {
                title: {
                    text: constants.yAxisTitle,
                },
            },
            series: [{
                name: constants.seriesName,
                data: this.ChartAxisPoints,
            }],
        });
    }

    handleChartUpdate(data) {
        _.forEach(data, (value) => {
            const alreadyPresent = _.findIndex(this.chartData, ['Time', value.Time]);
            if (alreadyPresent >= 0) {
                this.chartData[alreadyPresent] = value;

            } else {
                this.chartData.concat(value);
                const yAxisPoint = value.OpenAsk;
                const xAxisPoint = (new Date(value.Time)).getTime();
                this.chart.series[0].addPoint([xAxisPoint, yAxisPoint], true, true);
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

HighChartsTemplate.propTypes = {
    chartId: string.isRequired,
    ChartAxisPoints: array,
    chartData: array.isRequired,
};

export default bindHandlers(HighChartsTemplate);
