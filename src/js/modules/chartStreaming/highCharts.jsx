import React from 'react';
import Highcharts from 'highcharts';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { string, array } from 'prop-types';
import { CHARTCONSTANTS } from 'src/js/utils/constants';

class HighCharts extends React.PureComponent {
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
                type: CHARTCONSTANTS.CHARTTYPE,
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: CHARTCONSTANTS.MARGINRIGHT,
            },
            title: {
                text: CHARTCONSTANTS.TITLETEXT,
            },
            xAxis: {
                title: {
                    text: CHARTCONSTANTS.XAXISTITLE,
                },
                type: CHARTCONSTANTS.XAXISTYPE,
            },
            yAxis: {
                title: {
                    text: CHARTCONSTANTS.YAXISTITLE,
                },
            },
            series: [{
                name: CHARTCONSTANTS.SERIESNAME,
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

HighCharts.propTypes = {
    chartId: string.isRequired,
    ChartAxisPoints: array,
    chartData: array.isRequired,
};

export default bindHandlers(HighCharts);
