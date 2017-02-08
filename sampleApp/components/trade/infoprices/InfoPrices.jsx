import React from 'react';
import { merge, transform, uniq, forEach } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import Instrument from '../../ref/instruments/Instruments';
import InfoPricesTemplate from './InfoPricesTemplate';

class InfoPrices extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instruments = {};
    this.assetTypes = [];
    this.state = {
      instrumentSelected: false,
      instrumentsSubscribed: false,
      changed: false,
    };
  }

  handleInstrumentSelected(instrument) {
    this.setState({
      instrumentSelected: false,
    });
    API.getInfoPrices({
      AssetType: instrument.AssetType,
      Uic: instrument.Identifier,
    }, this.handleUpdateInstrumentData,
    result => console.log(result));
  }

  handleUpdateInstrumentData(data) {
    this.instruments[data.Uic] = data;
    this.assetTypes.push(data.AssetType);
    this.setState({
      instrumentSelected: true,
    });
  }

  handleUpdateSubscribedInstruments(instruments) {
    this.setState({
      changed: false
    });
    const instrumentData = instruments.Data;
    forEach(instrumentData, (value, index) => {
      merge(this.instruments[instrumentData[index].Uic], instrumentData[index]);
    });
    this.setState({
      changed: true
    });
  }

  handleSubscribeInstruments() {
    if (!this.state.instrumentsSubscribed) {
      forEach(uniq(this.assetTypes), (value) => {
        const uics = transform(this.instruments, ((concat, instrument) => {
          if (instrument.AssetType === value) {
            return concat.uic = concat.uic ? `${concat.uic},${instrument.Uic}` : instrument.Uic;
          }
        }), {});
        API.subscribeInfoPrices({
          Uics: uics.uic,
          AssetType: value,
        }, this.handleUpdateSubscribedInstruments);
      });
      this.setState({
        instrumentsSubscribed: true,
      });
    } else {
      API.disposeSubscription(() => console.log('disposed subscription successfully'),
        () => console.log('Error disposing subscription'));
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
      API.getInfoPricesList({
        Uics: uics.uic,
        AssetType: value,
      }, this.handleUpdateSubscribedInstruments);
    });
  }

  render() {
    return (
      <div>
        <Instrument onInstrumentSelected={this.handleInstrumentSelected} />
        <InfoPricesTemplate
          props={this.state}
          getInstrumentData={this.instruments}
          handleSubscribeInstruments={this.handleSubscribeInstruments}
          handleFetchInstrumentsData={this.handleFetchInstrumentsData}
        />
      </div>
    );
  }
}

export default bindHandlers(InfoPrices);
