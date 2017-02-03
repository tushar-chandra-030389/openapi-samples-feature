import React from 'react';
import { merge } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import Details from '../../Details';
import Instruments from '../../ref/instruments/Instruments';
import PricesTemplate from './PricesTemplate';

class Prices extends React.Component {
  constructor(props) {
    super(props);
    this.instrument = {};
    this.description = 'Shows how to get prices and other trade related information and keep the prices updated as events are recieved over the streaming channel.';
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
      <Details Title='Prices - Streaming' Description={this.description}>
        <Instruments parent='true' onInstrumentSelected={this.handleInstrumentSelected} />
        <PricesTemplate state={this.state} instrumentPrices={this.instrument} />
      </Details>
    );
  }
}

export default bindHandlers(Prices)
