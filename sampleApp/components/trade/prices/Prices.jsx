import React from 'react';
import { merge } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import Details from '../../Details';
import OptionInstruments from '../../ref/instruments/OptionInstruments';
import PricesTemplate from './PricesTemplate';
import { Col } from 'react-bootstrap';

class Prices extends React.Component {
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
    if(this.subscription) {
      API.disposeIndividualSubscription(this.subscription);
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
      <div className='pad-box'>
        <Col sm={8}>
          <OptionInstruments onInstrumentSelected={this.handleInstrumentSelected} />
          <PricesTemplate instrumentPrices={this.instrument} />
        </Col>
      </div>
    );
  }
}

export default bindHandlers(Prices);
