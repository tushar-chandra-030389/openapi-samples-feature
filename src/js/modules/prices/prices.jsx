import React from 'react';
import {merge} from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import * as API from '../../utils/api';
import PropTypes from 'prop-types';
import {Col} from 'react-bootstrap';

import PricesTemplate from './PricesTemplate';
import Error from '../error';
import DetailsHeader from '../../components/detailsHeader';
import Assets from '../assets';

class Prices extends React.PureComponent {
    constructor() {
        super();
        this.instrument = undefined;
        this.state = {
            instrumentSelected: false,
        };
        this.subscription = undefined;
    }

    handleInstrumentSelected(instrument) {
        //TODO : Batch Request
        if (this.subscription) {
            API.removeIndividualSubscription(this.subscription);
            this.subscription = undefined;
        }

        this.subscription = API.subscribePrices({
            AssetType: instrument.AssetType,
            uic: instrument.Uic,
        }, this.handleUpdateInstrumentData);
    }

    handleUpdateInstrumentData(data) {
        if (!data.Data) {
            this.instrument = data;
        } else {
            merge(this.instrument, data.Data);
        }
        this.setState({
            instrumentSelected: !this.state.instrumentSelected,
        });
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className='pad-box'>
                    <Error>
                        Enter correct access token using
                        <a href='#/userInfo'> this link.</a>
                    </Error>
                    <Col sm={8}>
                        <Assets  {...this.props} onInstrumentSelected={this.handleInstrumentSelected}/>
                        <PricesTemplate instrumentPrices={this.instrument}/>
                    </Col>
                </div>
            </div>
        );
    }
}

Prices.propTypes = {
    hideError: PropTypes.func,
    showError: PropTypes.func,
    hideLoader: PropTypes.func,
    showLoader: PropTypes.func,
}

export default bindHandlers(Prices);
