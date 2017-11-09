import React from 'react';
import { Table, Panel } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

function OptionChainTemplate(props) {
    const rows = [];
    _.forOwn(props.data, (val, key) => {
        const { Call, Put, Strike } = val;
        rows.push(
            <tr key={key}>
                <td>{Call.PriceTypeBid === 'Pending' ? '-' : Call.Bid}</td>
                <td>{Call.PriceTypeAsk === 'Pending' ? '-' : Call.Ask}</td>
                <td>{Call.LastTraded ? Call.LastTraded : '-'}</td>
                <td><em><b>{Strike}</b></em></td>
                <td>{Put.PriceTypeBid === 'Pending' ? '-' : Put.Bid}</td>
                <td>{Put.PriceTypeAsk === 'Pending' ? '-' : Put.Ask}</td>
                <td>{Put.LastTraded ? Put.LastTraded : '-'}</td>
            </tr>
        );
    });

    return (
        <div>
            {
                props.data && (
                    <Panel className="option-chain-panel" bsStyle="primary">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Calls</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>Puts</th>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th>Bid</th>
                                    <th>Ask</th>
                                    <th>LastTraded</th>
                                    <th><em>StrikePrice</em></th>
                                    <th>Bid</th>
                                    <th>Ask</th>
                                    <th>LastTraded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </Table>
                    </Panel>)
            }
        </div>
    );
}

OptionChainTemplate.propTypes = {
    data: PropTypes.array,
};

export default OptionChainTemplate;
