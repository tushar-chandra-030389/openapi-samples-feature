import React from 'react';
import Column from '../../../../sampleApp/components/utils/Column';
import { Row, ControlLabel, Panel, Col } from 'react-bootstrap';
import CustomTable from '../../utils/CustomTable';

export default (props) => {

  const  generateHtml = (item, header) => {
    let data = []
    for(let name in item) {
      if(typeof item[name] !== 'object' )
        data.push({FieldName:name, Value: item[name]});
    }

    return ( 
      <div>
        <h4><strong>{header}:</strong></h4>
        { data.length > 0 ?
          (<CustomTable data={data} width={'300'} keyField='FieldName' />) :
          <strong>No data available</strong>
        }
      </div>
    )
  }

  return (
    <div>
      {props.instrumentPrices && (
        <Panel bsStyle="primary" >
          {generateHtml(props.instrumentPrices,'Basic Info')}
          {generateHtml(props.instrumentPrices.PriceInfoDetails,'PriceInfoDetails')}
          {generateHtml(props.instrumentPrices.PriceInfo,'PriceInfo')}
          {generateHtml(props.instrumentPrices.Quote,'Quote')}
          {generateHtml(props.instrumentPrices.InstrumentPriceDetails,'InstrumentPriceDetails')}
          {generateHtml(props.instrumentPrices.Commissions,'Commissions')}
          {generateHtml(props.instrumentPrices.DisplayAndFormat,'DisplayAndFormat')}
          {generateHtml(props.instrumentPrices.Greeks,'Greeks')}
          {generateHtml(props.instrumentPrices.MarginImpact,'MarginImpact')}
          {generateHtml(props.instrumentPrices.MarketDepth,'MarketDepth')}
        </Panel>
      )}
    </div>)
};