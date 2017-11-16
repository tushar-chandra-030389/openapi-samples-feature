import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Button } from 'react-bootstrap';
import { object } from 'prop-types';

import { subscribeChartData, unsubscribeChartData } from './queries';
import DetailsHeader from 'src/js/components/detailsHeader';
import DropDown from 'src/js/components/dropdown';
import Instrument from 'src/js/modules/assets/instruments';
import HighCharts from './highCharts';
import Error from 'src/js/modules/error';
import { HIGH_CHART_CONFIG } from 'src/js/utils/constants';

const Horizon = [1, 5, 10, 15, 30, 60, 120, 240, 360, 480, 1440, 10080, 43200];
const CandleCount = [200, 400, 600, 800, 1000, 1200];

class ChartStreaming extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instrument = {};
        this.chartData = [];
        this.chartSubscription = null;
        this.state = {
            instrumentSelected: false,
            horizon: 'Select Horizon',
            candleCount: '200',
            chartDataUpdated: false,
        };
        this.chartId = HIGH_CHART_CONFIG.CHART_ID;
    }
    componentWillUnmount() {
        if (this.chartSubscription) {
            unsubscribeChartData(this.props, this.chartSubscription);
        }
    }

    handleUnSubscribe() {
        if (this.chartSubscription) {
            unsubscribeChartData(this.props, this.chartSubscription);
        }
        this.chartData = [];
    }

    handleInstrumentSelected(instrument) {
        this.setState({
            instrumentSelected: false,
        });

        this.handleUnSubscribe();

        this.instrument = instrument;
        this.setState({
            instrumentSelected: true,
        });
    }

    handleChartData() {
        this.handleUnSubscribe();

        if (_.isNumber(parseInt(this.state.horizon, 10)) && !_.isEmpty(this.instrument)) {
            const chartData = {
                AssetType: this.instrument.AssetType,
                Uic: this.instrument.Uic,
                Horizon: parseInt(this.state.horizon, 10),
                Count: parseInt(this.state.candleCount, 10),
            };
            subscribeChartData(chartData, this.props, this.handleChartUpdate, (chartSubscription) => {
                this.chartSubscription = chartSubscription;
            });
        }
    }

    handleChartUpdate(response) {
        const { Data } = response;
        this.chartData = Data;
        this.setState({ chartDataUpdated: !this.state.chartDataUpdated });
    }

    handleHorizonSelection(eventKey) {
        this.handleUnSubscribe();
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
                        <a href="/userInfo"> this link.</a>
                    </Error>
                    <Instrument {...this.props} onInstrumentSelected={this.handleInstrumentSelected}
                        onOptionRootSelected={this.handleInstrumentSelected}
                    />
                    <DropDown
                        id="charStreamingDropDown1"
                        title={this.state.horizon}
                        handleSelect={this.handleHorizonSelection}
                        data={Horizon}
                    />

                    <DropDown
                        id="charStreamingDropDown2"
                        title={this.state.candleCount}
                        handleSelect={this.handleCandleCount}
                        data={CandleCount}
                    />

                    <Button
                        bsStyle="primary"
                        onClick={this.handleChartData}
                    > {'Subscribe Chart'}
                    </Button>
                    {!_.isEmpty(this.chartData) &&
                    <HighCharts
                        chartData={this.chartData}
                        chartId={this.chartId}
                    />
                    }
                </div>
            </div>
        );
    }
}

ChartStreaming.propTypes = { match: object };

ChartStreaming.defaultProps = { match: {} };

export default bindHandlers(ChartStreaming);
