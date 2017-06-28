import React from 'react';
import { merge } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import OptionInstruments from '../../ref/instruments/OptionInstruments';
import InfoPricesTemplate from './InfoPricesTemplate';

class InfoPrices extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { flag: false };
    this.selectedInstruments = {};
    this.selectedAssetTypes = {};
  }

  handleInstrumentSelected(instrument) {
    API.getInfoPrices({
      AssetType: instrument.AssetType,
      Uic: instrument.Uic,
    }, this.handleUpdateInstrumentData,
    result => console.log(result));
  }

  handleUpdateInstrumentData(data) {
    /* 
      reset selectedAssetTypes and then set it to assetType of data
    */
    this.selectedAssetTypes = {};
    this.selectedAssetTypes[data.AssetType] = { subscription: undefined };
    // reset selectedInstruments and then set it to data
    this.selectedInstruments = {};
    this.selectedInstruments[data.Uic] = data;

    this.setState({ flag: !this.state.flag });
  }

  handleSubscribe() {
    //TODO: Batch request
    for(let assetType in this.selectedAssetTypes) {
        this.createSubscription(assetType);
      }
    this.setState({ flag: !this.state.flag });
  }

  // openapi - create subscription.
  createSubscription(forAssetType) {
    // concatinate uics
    let uics = this.getUics(forAssetType);
    // subscribe for instruments
    let subscription = API.subscribeInfoPrices({ Uics: uics, AssetType: forAssetType }, this.onPriceUpdate.bind(this));
    // hold subscription
    this.selectedAssetTypes[forAssetType].subscription = subscription;
  }
  
  // openapi - callback function to handle price updates
  onPriceUpdate(update) {
    const instrumentData = update.Data;
    for(let index in instrumentData) {
      merge(this.selectedInstruments[instrumentData[index].Uic], instrumentData[index]);
    }
    this.setState({ flag: !this.state.flag });
  }

  handleUnsubscribe() {
    //TODO: Batch request
    for(var assetType in this.selectedAssetTypes) {
      this.deleteSubscription(assetType)
    }
    this.setState({ flag: !this.state.flag });
  }

  // openapi - delete subscription. 
  deleteSubscription(forAssetType) {
    if(this.selectedAssetTypes[forAssetType].subscription) {
      API.disposeIndividualSubscription(this.selectedAssetTypes[forAssetType].subscription);
      this.selectedAssetTypes[forAssetType].subscription = undefined;
    }
  }

  // utility function to concatinate uics.
  getUics(forAssetType) {
    let uics = '';
    for(let uic in this.selectedInstruments) {
      if( this.selectedInstruments[uic].AssetType === forAssetType ) {
        if(uics !== '') {
          uics = `${uic},${uics}`;
        }
        else {
          uics = `${uic}`;
        }
      }
    }
    return uics;
  }

  handleGetInfoPrices() {
    //TODO: Batch request
    for(var assetType in this.selectedAssetTypes) {
      this.fetchInfoPrice(assetType)
    }
  }

  fetchInfoPrice(forAssetType) {
    // concatinate uics
    let uics = this.getUics(forAssetType);
    API.getInfoPricesList({ Uics: uics, AssetType: forAssetType }, this.onPriceUpdate.bind(this));
  }

  // UI - required for UI to enable/disable function
  hasSubscription() {
    for(var assetType in this.selectedAssetTypes) {
      if(this.selectedAssetTypes[assetType] && this.selectedAssetTypes[assetType].subscription) {
        return true;
      }
    }    
    return false;
  }

  // UI - required for UI to show/hide instrument panel
  hasInsruments() {
    for(var uic in this.selectedInstruments) {
      return true;
    }
    return false;    
  }

  render() {
    return (
      <div className='pad-box' >
        <OptionInstruments onInstrumentSelected={this.handleInstrumentSelected} />
        { this.hasInsruments() && 
          <InfoPricesTemplate
            instruments={this.selectedInstruments}
            onSubscribeClick={this.handleSubscribe}
            onUnsubscribeClick={this.handleUnsubscribe}
            onGetInfoPricesClick={this.handleGetInfoPrices}
            hasSubscription={this.hasSubscription()} 
          />
        }
      </div>
    );
  }
}

export default bindHandlers(InfoPrices);
