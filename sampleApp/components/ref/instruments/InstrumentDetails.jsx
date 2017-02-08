import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Instruments from './Instruments';
import CustomTable from '../../utils/CustomTable';

class InstrumentDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      instrumentList: [],
    };
  }

  handleAssetTypeChange(assetType, instruments) {
    this.setState({
      instrumentList: instruments
    });
  }

  render() {
    return (
      <div className='pad-box'>
        <Instruments onAssetTypeSelected={this.handleAssetTypeChange} />
        <CustomTable
          data={this.state.instrumentList}
          keyField='Identifier'
          dataSortFields={['Identifier', 'Symbol']}
          width='150'
        />
      </div>
    );
  }
}

export default bindHandlers(InstrumentDetails);
