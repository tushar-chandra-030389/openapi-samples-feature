import React from 'react';
import _ from 'lodash';
import Highcharts from 'highcharts';
import { bindHandlers } from 'react-bind-handlers';
import { Button } from 'react-bootstrap';
import { object } from 'prop-types';
import { streamChartData, unSubscribeChartData } from './queries';
import DetailsHeader from 'src/js/components/detailsHeader';
import DropDown from 'src/js/components/dropdown';
import Instrument from 'src/js/modules/assets/instruments';
import CustomTable from 'src/js/components/customTable';
import Error from 'src/js/modules/error';

const Horizon = [1, 5, 10, 15, 30, 60, 120, 240, 360, 480, 1440, 10080, 43200];
const CandleCount = [200, 400, 600, 800, 1000, 1200];

class ChartStreaming extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instrument = {};
        this.chartResponse = [];
        this.chartDataSet = [];
        this.chartSubscription = null;
        this.state = {
            instrumentSelected: false,
            horizon: 'Select Horizon',
            candleCount: '200',
            flag: true,
        };
        this.chart = null;
    }

    handleInstrumentSelected(instrument) {
        this.setState({
            instrumentSelected: false,

        });

        if (this.chartSubscription) {
            unSubscribeChartData(this.props, this.chartSubscription);
        }
        this.chartDataSet = [];
        this.chartResponse = [];
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;

        }
        this.instrument = instrument;
    }

    handleChartData() {
        this.setState({
            flag: true,
        });
        if (_.isNumber(parseInt(this.state.horizon, 10)) && !_.isEmpty(this.instrument)) {
            const chartData = {
                AssetType: this.instrument.AssetType,
                Uic: this.instrument.Uic,
                Horizon: parseInt(this.state.horizon, 10),
                Count: parseInt(this.state.candleCount, 10),
            };
            streamChartData(chartData, this.props, this.handleChartUpdate, (chartSubscription) => {
                this.chartSubscription = chartSubscription;
            });
        }
    }

    handleChartUpdate(response) {
        const data = response.Data;
        this.setState({
            chartDataUpdated: false,
        });

        if (this.chartResponse.length === 0) {
            this.chartResponse = data;

            _.forEach(data, (value) => {

                const yAxisPoint = value.OpenAsk;
                const xAxisPoint = (new Date(value.Time)).getTime();
                const axisPoint = [xAxisPoint, yAxisPoint];
                this.chartDataSet.push(axisPoint);
            });

        } else {
            _.forEach(data, (value) => {
                const alreadyPresent = _.findIndex(this.chartResponse, (item) => item.Time === value.Time);

                if (alreadyPresent >= 0) {
                    this.chartResponse[alreadyPresent] = value;

                } else {
                    this.chartResponse.concat(value);
                    const yAxisPoint = value.OpenAsk;
                    const xAxisPoint = (new Date(value.Time)).getTime();
                    this.chart.series[0].addPoint([xAxisPoint, yAxisPoint], true, true);

                }
            });

        }
        if (this.chart === null) {
            this.chart = Highcharts.chart('dataTable', {

                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                },
                title: {
                    text: 'Live chart streaming data',
                },
                xAxis: {
                    title : {
                        text : 'Time'
                    },
                    type: 'datetime',
                },
                yAxis: {
                    title: {
                        text: 'openAsk'
                    }
                },
                series: [{
                    name: 'charts data',
                    data: this.chartDataSet,
                }],
            });

        }

        this.setState({
            chartDataUpdated: true,
        });

    }

    handleHorizonSelection(eventKey) {
        this.setState({
            horizon: eventKey.toString(),
        });
    }

    handleCandleCount(eventKey) {
        this.setState({
            candleCount: eventKey.toString(),
        });
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <Instrument {...this.props} onInstrumentSelected={this.handleInstrumentSelected}/>
                    <DropDown
                        id="charPollingDropDown1"
                        title={this.state.horizon}
                        handleSelect={this.handleHorizonSelection}
                        data={Horizon}
                    /> &nbsp;

                    <DropDown
                        id="charPollingDropDown2"
                        title={this.state.candleCount}
                        handleSelect={this.handleCandleCount}
                        data={CandleCount}
                    /> &nbsp;

                    <Button
                        bsStyle="primary"
                        onClick={this.handleChartData}
                    > {'Subscribe Chart'}
                    </Button>

                    <CustomTable
                        data={this.chartResponse.Data}
                        keyField={'Time'}
                        dataSortFields={['Time']}
                        width={'150'}
                    />

                </div>
            </div>
        );
    }
}

ChartStreaming.propTypes = { match: object };

ChartStreaming.defaultProps = { match: {} };

export default bindHandlers(ChartStreaming);
