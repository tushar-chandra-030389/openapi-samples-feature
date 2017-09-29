import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Button } from 'react-bootstrap';

import * as queries from './queries';
import DropDown from '../../components/dropdown';
import Instrument from '../assets/instruments';
import CustomTable from '../../components/customTable';
import Error from '../error';

const Horizon = [1, 5, 10, 15, 30, 60, 120, 240, 360, 480, 1440, 10080, 43200];
const CandleCount = [200, 400, 600, 800, 1000, 1200];

class ChartPolling extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instrument = {};
        this.chartResponse = {};
        this.state = {
            instrumentSelected: false,
            horizon: 'Horizon',
            candleCount: 200,
        };
    }

    handleInstrumentSelected(instrument) {
        this.setState({
            instrumentSelected: false,
        });
        this.instrument = instrument;
    }

    handleChartData() {
        if (_.isNumber(this.state.horizon) && !_.isEmpty(this.instrument)) {
            const chartData = {
                AssetType: this.instrument.AssetType,
                Uic: this.instrument.Uic,
                Horizon: this.state.horizon,
                Count: this.state.candleCount,
            };
            queries.getInfo('getChartData', this.props, this.handleChartDataDisplay, chartData);
        }
    }

    handleChartDataDisplay(response) {
        this.chartResponse = response;
        this.setState({
            instrumentSelected: true,
        });
    }

    handleHorizonSelection(eventKey) {
        this.setState({
            horizon: eventKey,
        });
    }

    handleCandleCount(eventKey) {
        this.setState({
            candleCount: eventKey,
        });
    }

    render() {
        return (
            <div>
                <Instrument {...this.props} onInstrumentSelected={this.handleInstrumentSelected}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <DropDown
                        id="charPollingDropDown1"
                        title="Horizon1"
                        handleSelect={this.handleHorizonSelection}
                        data={Horizon}
                    /> &nbsp;

                    <DropDown
                        id="charPollingDropDown2"
                        title="Horizon2"
                        handleSelect={this.handleCandleCount}
                        data={CandleCount}
                    /> &nbsp;

                    <Button
                        bsStyle="primary"
                        onClick={this.handleChartData}
                    >
                        Get Chart Data
                    </Button>
                    {this.state.instrumentSelected &&
                    <CustomTable
                        data={this.chartResponse.Data}
                        keyField={'Time'}
                        dataSortFields={['Time']}
                        width={'150'}
                        decimals={this.chartResponse.DisplayAndFormat.Decimals}
                    />
                    }
                </div>
            </div>
        );
    }
}

export default bindHandlers(ChartPolling);