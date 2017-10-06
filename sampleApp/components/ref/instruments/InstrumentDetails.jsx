import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Instruments from './Instruments';
import CustomTable from '../../utils/CustomTable';
import { Col,Panel } from 'react-bootstrap';
import OptionInstruments from './OptionInstruments';
import { partition, concat, isArray, forEach, findIndex, defaults, forOwn, isNull} from 'lodash';
import refDataAPI from '../refDataAPI';
import update from 'immutability-helper';
import moment from 'moment';

const checkIfOption = (assetType) => assetType === 'FuturesOption' || assetType === 'StockOption' || assetType === 'StockIndexOption';

class InstrumentDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = { instrumentDetails: undefined };
    this.idArrayForWhichSymbolRequired = ['RelatedOptionRoots'];
  }

  getSymbolForID(instrumentDetails) { // this methods repaces the values of ids in idArrayForWhichSymbolRequired with symbol by calling refAPI 
    var getSymbolFromRefAPI = function(key,value,index){
      console.log(key, value, index);
      refDataAPI.getOptionRootData(value, result => {
          if(isNull(index))
            this.setState({instrumentDetails: update(instrumentDetails, {[key]: {$set: result.Symbol}})});
          else
            this.setState({instrumentDetails: update(instrumentDetails, {[key]: {$splice: [[index,1,result.Symbol]]}})});
        })
    }

    forOwn(instrumentDetails, (value,key)=>{  //get symbol for the IDs in array 'idArrayforWhichSymbolRequired'
      if((findIndex(this.idArrayForWhichSymbolRequired, field => field === key) !== -1)){
        if(isArray(value)){
          forEach(value,(val,index) => {
            getSymbolFromRefAPI.call(this,key,val,index);
          })
        }else{
            getSymbolFromRefAPI.call(this,key,value,null); 
        }    
      }
    });
  }

  handleInstrumentSelection(instrumentDetails) {
    //put Uic and symbol on top of instrument details
    let rearrangedInstrumentDetails = defaults({'Uic':instrumentDetails.Uic}, {'Symbol':instrumentDetails.Symbol}, instrumentDetails);
    //date are received in two different forms from open API, standardize date format in instrumentDetails
    /*forOwn(rearrangedInstrumentDetails, (value,key) => {
      if(moment(value,["YYYY-MM-DD",moment.ISO_8601],true).isValid()){
        rearrangedInstrumentDetails[key] = new Date(value);
      }
    })*/
    this.setState({ instrumentDetails: rearrangedInstrumentDetails })
    this.getSymbolForID(rearrangedInstrumentDetails);
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