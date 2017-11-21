import React from 'react';
import { Panel } from 'react-bootstrap';
import _ from 'lodash';
import { object } from 'prop-types';
import CustomTable from 'src/js/components/customTable';

class PricesTemplate extends React.PureComponent {
    generateTemplate(item, header) {
        const data = [];
        for (const name in item) {
            if (typeof item[name] !== 'object') {
                data.push({ FieldName: name, Value: item[name] });
            }
        }
        return (
            <div>
                <h4><strong>{header}:</strong></h4>
                {
                    data.length > 0 ?
                        <CustomTable data={data} width={'300'} keyField="FieldName" showUpdateAnim/> :
                        <strong>No data available</strong>
                }
            </div>
        );
    }

    hasInstrumentPrices() {
        return !(_.isEmpty(this.props.instrumentPrices));
    }

    render() {
        return (
            <div>
                {this.hasInstrumentPrices() && (
                    <Panel bsStyle="primary" >
                        {this.generateTemplate(this.props.instrumentPrices, 'Basic Info')}
                        {this.generateTemplate(this.props.instrumentPrices.PriceInfoDetails, 'PriceInfoDetails')}
                        {this.generateTemplate(this.props.instrumentPrices.PriceInfo, 'PriceInfo')}
                        {this.generateTemplate(this.props.instrumentPrices.Quote, 'Quote')}
                        {this.generateTemplate(this.props.instrumentPrices.InstrumentPriceDetails, 'InstrumentPriceDetails')}
                        {this.generateTemplate(this.props.instrumentPrices.Commissions, 'Commissions')}
                        {this.generateTemplate(this.props.instrumentPrices.DisplayAndFormat, 'DisplayAndFormat')}
                        {this.generateTemplate(this.props.instrumentPrices.Greeks, 'Greeks')}
                        {this.generateTemplate(this.props.instrumentPrices.MarginImpact, 'MarginImpact')}
                        {this.generateTemplate(this.props.instrumentPrices.MarketDepth, 'MarketDepth')}
                    </Panel>
                )}
            </div>
        );
    }
}

PricesTemplate.propTypes = { instrumentPrices: object };

PricesTemplate.defaultProps = { instrumentPrices: {} };

export default PricesTemplate;
