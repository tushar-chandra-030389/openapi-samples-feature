import React from 'react';
import { merge, transform, toArray, uniq, forEach } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import Details from '../../Details';
import Instrument from '../../ref/instruments/Instruments';
import InfoPricesTemplate from './InfoPricesTemplate';

class InfoPrices extends React.Component {
  constructor(props) {
    super(props);
    this.instruments = {};
    this.assetTypes = [];
    this.description = 'Shows how to get prices and other trade related information and keep the prices updated as events are recieved over the streaming channel.';
    this.state = {
      instrumentSelected: false,
      instrumentsSubscribed: false,
      changed: false,
    };
  }

  handleInstrumentSelected(instrument) {
    API.getInfoPrices({
      AssetType: instrument.AssetType,
      Uic: instrument.Identifier,
    }, this.handleUpdateInstrumentData,
		(result) => console.log(result));
  }

  handleUpdateInstrumentData(data) {
    this.instruments[data.Uic] = data;
    this.assetTypes.push(data.AssetType);
    this.setState({
      instrumentSelected: true,
    });
  }

  handleUpdateSubscribedInstruments(instruments) {
    const instrumentData = instruments.Data;
    forEach(instrumentData, (value, index) => {
      merge(this.instruments[instrumentData[index].Uic], instrumentData[index]);
    });
    this.setState({ changed: true });
  }

  handleSubscribeInstruments() {
    if (!this.state.instrumentsSubscribed) {
      forEach(uniq(this.assetTypes), (value) => {
        const uics = transform(this.instruments, ((concat, instrument) => {
          if (instrument.AssetType === value) {
            concat.uic = concat.uic ? `${concat.uic},${instrument.Uic}` : instrument.Uic;
          }
        }), {});
        API.subscribeInfoPrices({ Uics: uics.uic, AssetType: value }, this.handleUpdateSubscribedInstruments);
      });
      this.setState({
        instrumentsSubscribed: true,
      });
    } else {
      API.disposeSubscription(() => console.log('disposed subscription successfully'), () => console.log('Error disposing subscription'));
      this.setState({
        instrumentsSubscribed: false,
      });
    }
  }

  handleFetchInstrumentsData() {
    forEach(uniq(this.assetTypes), (value) => {
      const uics = transform(this.instruments, ((concat, instrument) => {
        if (instrument.AssetType === value) {
          concat.uic = concat.uic ? `${concat.uic},${instrument.Uic}` : instrument.Uic;
        }
      }), {});
      API.getInfoPricesList({ Uics: uics.uic, AssetType: value }, this.handleUpdateSubscribedInstruments);
    });
  }

  highlightCell() {
    if (this.state.changed) {
      setTimeout(() => this.setState({ changed: false }), 1000);
    }
    return this.state.changed ? 'highlight' : '';
  }

  render() {
    return (
      <Details Title='Info Prices' Description={this.description}>
        <Instrument parent='true' onInstrumentSelected={this.handleInstrumentSelected} />
        <InfoPricesTemplate state={this.state} getInstrumentData={toArray(this.instruments)} handleSubscribeInstruments={this.handleSubscribeInstruments} handleFetchInstrumentsData={this.handleFetchInstrumentsData} />
      </Details>
    );
  }
}

export default bindHandlers(InfoPrices)
