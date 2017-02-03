import React from 'react';
import Details from '../../Details';
import InstrumentTemplate from './InstrumentTemplate';
import API from '../../utils/API';
import { bindHandlers } from 'react-bind-handlers';

class Instruments extends React.Component {
  constructor(props) {
    super(props);
    this.assetTypes = ['FxSpot', 'Bond', 'Cash', 'Stock', 'CfdOnFutures', 'CfdOnIndex', 'CfdOnStock', 'ContractFutures', 'FuturesStrategy', 'StockIndex', 'ManagedFund'];
    this.instrumentList = [];
    this.description = 'Shows how to get instruments details based on Asset Type';
    this.state = { hasInstruments: false, searchTerm: '', assetType: 'Select Asset Type', instrument: 'Select Instrument' };
  }

  handleAssetTypeSelected(eventKey, event) {
    this.setState({ searchTerm: '', assetType: eventKey, instrument: 'Select Instrument' });
    API.getInstruments({ AssetTypes: eventKey },
      this.handleInstrumentsUpdated,
      (result) => console.log(result)
    );
  }

  handleInstrumentsUpdated(result) {
    this.instrumentList = result.Data;
    this.setState({
      hasInstruments: true,
    });
  }

  handleInstrumentSelected(eventKey, event) {
    this.setState({ instrument: eventKey.Description });
    if (this.props.parent) {
      this.props.onInstrumentSelected(eventKey);
    }
  }

  handleSearchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  render() {
    return (
      <div>
        {this.props.parent ?
          (<InstrumentTemplate state={this.state} assetTypes={this.assetTypes} instrumentList={this.instrumentList} handleAssetTypeSelected={this.handleAssetTypeSelected} parent={this.props.parent} handleInstrumentSelected={this.handleInstrumentSelected} />)
          : (<Details Title='Ref Data - EndPoint: v1/instruments' Description={this.description}>
              <InstrumentTemplate state={this.state} assetTypes={this.assetTypes} instrumentList={this.instrumentList} handleAssetTypeSelected={this.handleAssetTypeSelected} parent={this.props.parent} searchUpdated={this.handleSearchUpdated} />
          </Details>)
        }
      </div>
    );
  }
}

export default bindHandlers(Instruments);
