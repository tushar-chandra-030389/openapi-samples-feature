import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Instruments from './Instruments';
import OptionInstrumentsTemplate from './OptionInstrumentsTemplate'
import { Panel } from 'react-bootstrap';

const checkIfOption = (assetType) => assetType === 'FuturesOption' || assetType === 'StockOption' || assetType === 'StockIndexOption';

class OptionInstruments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { optionRoot: undefined };
  }

  handleOptionRoot(optionRoot) {
    console.log("optionRoot", optionRoot);
    this.setState({ optionRoot: optionRoot });
  }

  handleInstrumentSelection(instrumentDetails) {
    this.props.onInstrumentSelected(instrumentDetails);
  }

  handleAssetTypeChange(assetType) {
    if(!checkIfOption(assetType)) {
      this.setState({ optionRoot: undefined,
        instrumentDetails: undefined});
    }
  }

  render() {
    // making array of key-value pairs to show instrument in table.
    let instData = []
    for(let name in this.state.instrumentDetails) {
        instData.push({FieldName:name, Value: this.state.instrumentDetails[name]});
    }
    return (
      <div>
          <Instruments onInstrumentSelected={this.handleInstrumentSelection} onOptionRootSelected={this.handleOptionRoot} onAssetTypeSelected={this.handleAssetTypeChange}  />
          { this.state.optionRoot &&
              <Panel bsStyle="primary" ><OptionInstrumentsTemplate optionRoot={this.state.optionRoot} onInstrumentSelected={this.handleInstrumentSelection}  /></Panel>
          }
      </div>
    );
  }
}

OptionInstruments.propTypes = {
  onInstrumentSelected: React.PropTypes.func,
};

export default bindHandlers(OptionInstruments);