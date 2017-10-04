import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import * as queries from './queries';
import DetailsHeader from 'src/js/components/detailsHeader';
import DropDown from 'src/js/components/dropdown';
import Instrument from 'src/js/modules/assets/instruments';
import CustomTable from 'src/js/components/customTable';
import Error from 'src/js/modules/error';

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
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <Instrument {...this.props} onInstrumentSelected={this.handleInstrumentSelected}/>
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

ChartPolling.propTypes = {
    match: PropTypes.shape(
        {
            url: PropTypes.string,
        }
    ),
};

export default bindHandlers(ChartPolling);
