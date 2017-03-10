import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Instruments from './Instruments';
import CustomTable from '../../utils/CustomTable';
import { Col,Panel } from 'react-bootstrap';
import OptionInstruments from './OptionInstruments'

const checkIfOption = (assetType) => assetType === 'FuturesOption' || assetType === 'StockOption' || assetType === 'StockIndexOption';

class InstrumentDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = { instrumentDetails: undefined };
  }

  handleInstrumentSelection(instrumentDetails) {
    this.setState({ instrumentDetails: instrumentDetails });
  }

  render() {
    // making array of key-value pairs to show instrument in table.
    let instData = []
    for(let name in this.state.instrumentDetails) {
        instData.push({FieldName:name, Value: this.state.instrumentDetails[name]});
    }

    let hasData = instData.length > 0;

    return (
      <div className='pad-box' >
        <Col sm={8} >
          <OptionInstruments onInstrumentSelected={this.handleInstrumentSelection} />
          {hasData && 
            <Panel bsStyle='primary'><CustomTable data={instData} width={'300'} keyField='FieldName' /></Panel>
          }
        </Col>
      </div>
    );
  }
}

export default bindHandlers(InstrumentDetails);