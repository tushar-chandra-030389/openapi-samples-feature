import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ButtonToolbar } from 'react-bootstrap';
import { noop } from 'lodash';
import API from '../../utils/API';
import DropDown from '../../utils/DropDown';

const AssetTypes = [
  'FxSpot',
  'Bond',
  'Cash',
  'Stock',
  'CfdOnFutures',
  'CfdOnIndex',
  'CfdOnStock',
  'ContractFutures',
  'FuturesStrategy',
  'StockIndex',
  'ManagedFund',
  'StockOption',
  'StockIndexOption',
  'FuturesOption',
];

class Instruments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instruments = [];
    this.state = {
      hasInstruments: false,
      selectedAssetType: 'Select Asset Value',
      selectedInstrument: 'Select Instrument'
    };
  }

  handleAssetTypeSelection(eventKey) {
    this.instruments = [];
    this.setState({
      selectedAssetType: eventKey,
      selectedInstrument: 'Select Instrument',
      hasInstruments: false,
    })
    API.getInstruments({
      AssetTypes: eventKey,
    }, result => this.handleSuccess(result, eventKey),
      result => console.log(result),
    );
  }

  handleSuccess(result, eventKey) {
    this.instruments = result.Data;
    if (this.props.onAssetTypeSelected) {
      this.props.onAssetTypeSelected(eventKey, result.Data);
    }
    this.setState({
      hasInstruments: true,
    });
  }

  handleInstrumentSelection(eventKey) {
    this.setState({
      selectedInstrument: eventKey.Description
    });
    this.props.onInstrumentSelected(eventKey);
  }

  render() {
    return (
      <div className='pad-box'>
        <ButtonToolbar>
          <DropDown
            title={this.state.selectedAssetType}
            handleSelect={this.handleAssetTypeSelection}
            data={AssetTypes}
          />
          { this.state.hasInstruments &&
            (<DropDown
              title={this.state.selectedInstrument}
              handleSelect={this.handleInstrumentSelection}
              data={this.instruments}
              itemKey='Symbol'
              value='Description'
            />)
          }
        </ButtonToolbar>
      </div>
    );
  }
}

Instruments.propTypes = {
  onInstrumentSelected: React.PropTypes.func,
  onAssetTypeSelected: React.PropTypes.func,
};

Instruments.defaultProps = {
  onInstrumentSelected: noop,
};

export default bindHandlers(Instruments);
