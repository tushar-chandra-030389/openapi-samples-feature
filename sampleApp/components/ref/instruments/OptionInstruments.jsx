import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Instruments from './Instruments';
import OptionInstrumentsTemplate from './OptionInstrumentsTemplate';
import { Panel, Form, FormControl, Row, Col} from 'react-bootstrap';
import FormGroupTemplate from '../../utils/FormGroupTemplate';
import DatePicker from 'react-datePicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


const checkIfOption = (assetType) => assetType === 'FuturesOption' || assetType === 'StockOption' || assetType === 'StockIndexOption';
const checkIfPutCallExpiryRequired = (assetType) => assetType === 'FxVanillaOption';
class OptionInstruments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { optionRoot: undefined, putCallExpiryRequired : false, optionRootSelected : false};
    this.putCallExpiry = null;
    this.putCall = "Call";
    this.expiryDate = moment();
    this.instrumentDetails = {};
  }

  handleOptionRoot(optionRoot) {
    this.setState({ optionRoot: optionRoot });
    this.forceUpdate();
  }

  handleInstrumentSelection(instrumentDetails) {
    this.instrumentDetails = instrumentDetails;
    if(this.state.putCallExpiryRequired){
      instrumentDetails.PutCall = this.putCall;
      instrumentDetails.Expiry = moment.utc(this.expiryDate).toISOString();
    }
    this.props.onInstrumentSelected(instrumentDetails);
  }

  handleAssetTypeChange(assetType) {
    if(!checkIfOption(assetType)) {
      if(!checkIfPutCallExpiryRequired(assetType)){
          this.setState({ optionRoot: undefined,
            optionRootSelected : false,
            instrumentDetails: undefined,
            putCallExpiryRequired: false});
        }else{
          this.setState({
            optionRoot : undefined,
            optionRootSelected : false,
            putCallExpiryRequired : true,
            instrumentDetails : undefined
          });
        }
    }else{
      this.setState({ 
        optionRoot : undefined,
        optionRootSelected : true,
        instrumentDetails : undefined,
        putCallExpiryRequired : false
      });
    }
  }


  handleExpiryDateChange(date){
    this.expiryDate = date;
    this.handleInstrumentSelection(this.instrumentDetails);

  }

  handlePutCallChange(event){
    this.putCall = event.target.value;
    this.handleInstrumentSelection(this.instrumentDetails);
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
          { this.state.optionRootSelected && this.state.optionRoot &&
              <Panel bsStyle="primary" ><OptionInstrumentsTemplate optionRoot={this.state.optionRoot} onInstrumentSelected={this.handleInstrumentSelection}  /></Panel>
          }
          {
            // this. is specific for instruments that required put/call and expiry date in info price request eg. FxVanillaOption
            this.state.putCallExpiryRequired &&
                 <Panel>
                  <Form>
                    <Row>
                      <Col sm={2}>
                        <DatePicker
                          selected={this.expiryDate}
                          onChange={this.handleExpiryDateChange.bind(this)} />
                      </Col>
                      <Col sm={2}>
                      <FormControl componentClass="select" placeholder="Call" onChange={(event)=>this.handlePutCallChange(event)}>
                        <option value="Put">Put</option>
                        <option value="Call">Call</option>
                      </FormControl>
                      </Col>
                    </Row>
                  </Form>
                  </Panel>
          }
      </div>
    );
  }
}

OptionInstruments.propTypes = {
  onInstrumentSelected: React.PropTypes.func,
};

export default bindHandlers(OptionInstruments);