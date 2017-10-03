import React from 'react';
import { Panel } from 'react-bootstrap';
import _ from 'lodash';
import { object } from 'prop-types';
import CustomTable from '../../components/customTable';

class PricesTemplate extends React.PureComponent {
    generateHtml(item, header) {
        const data = [];
        for (const name in item) {
            if (typeof item[name] !== 'object') {
                data.push({ FieldName: name, Value: item[name] });
            }
        }
        return (
            <div>
                <h4><strong>{header}:</strong></h4>
                {data.length > 0 ?
                    (<CustomTable data={data} width={'300'} keyField="FieldName" />) :
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
                        {this.generateHtml(this.props.instrumentPrices, 'Basic Info')}
                        {this.generateHtml(this.props.instrumentPrices.PriceInfoDetails, 'PriceInfoDetails')}
                        {this.generateHtml(this.props.instrumentPrices.PriceInfo, 'PriceInfo')}
                        {this.generateHtml(this.props.instrumentPrices.Quote, 'Quote')}
                        {this.generateHtml(this.props.instrumentPrices.InstrumentPriceDetails, 'InstrumentPriceDetails')}
                        {this.generateHtml(this.props.instrumentPrices.Commissions, 'Commissions')}
                        {this.generateHtml(this.props.instrumentPrices.DisplayAndFormat, 'DisplayAndFormat')}
                        {this.generateHtml(this.props.instrumentPrices.Greeks, 'Greeks')}
                        {this.generateHtml(this.props.instrumentPrices.MarginImpact, 'MarginImpact')}
                        {this.generateHtml(this.props.instrumentPrices.MarketDepth, 'MarketDepth')}
                    </Panel>
                )}
            </div>
        );
    }
}

PricesTemplate.propTypes = { instrumentPrices: object };

PricesTemplate.defaultProps = { instrumentPrices: {} };

export default PricesTemplate;
