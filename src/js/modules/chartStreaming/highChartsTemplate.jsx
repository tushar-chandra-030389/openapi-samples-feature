import React from 'react';
import Highcharts from 'highcharts';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { string, array } from 'prop-types';
import * as highChartConst from '../../data/highchartContent';

class HighChartsTemplate extends React.PureComponent {
    constructor(props) {
        super(props);
        this.chartData = props.chartData;
        this.chartDataSet = [];
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
            this.chartDataSet.push(axisPoint);
        });

        this.chart = Highcharts.chart(this.props.chartId, {
            chart: {
                type: highChartConst.chartType,
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: highChartConst.marginRight,
            },
            title: {
                text: highChartConst.titleText,
            },
            xAxis: {
                title: {
                    text: highChartConst.xAxisTitle,
                },
                type: highChartConst.xAxisType,
            },
            yAxis: {
                title: {
                    text: highChartConst.yAxisTitle,
                },
            },
            series: [{
                name: highChartConst.seriesName,
                data: this.chartDataSet,
            }],
        });
    }

    handleChartUpdate(data) {
        _.forEach(data, (value) => {
            const alreadyPresent = _.findIndex(this.chartData, (item) => item.Time === value.Time);
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
    chartId: string,
    chartDataSet: array,
    chartData: array,
};

export default bindHandlers(HighChartsTemplate);
