import React from 'react';
import { merge } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import Details from '../../Details';
import Instruments from '../../ref/instruments/Instruments';
import PricesTemplate from './PricesTemplate';

class Prices extends React.Component {
  constructor() {
    super();
    this.instrument = {};
    this.state = {
      instrumentSelected: false,
    };
  }

  handleInstrumentSelected(instrument) {
    API.subscribePrices({
      AssetType: instrument.AssetType,
      uic: instrument.Identifier,
    }, this.handleUpdateInstrumentData);
  }

  handleUpdateInstrumentData(data) {
    this.setState({
      instrumentSelected: true,
    });
    if (!data.Data) {
      this.instrument = data;
    } else {
      merge(this.instrument, data.Data);
    }
  }

  render() {
    return (
      <div>
        <Instruments onInstrumentSelected={this.handleInstrumentSelected} />
        <PricesTemplate props={this.state} instrumentPrices={this.instrument} />
      </div>
    );
  }
}

export default bindHandlers(Prices);
