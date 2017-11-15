import React from 'react';
import { Table, Panel } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

class OptionChainTemplate extends React.PureComponent {

    constructor() {
        super();
        this.rows = [];
        this.state = {
            tableUpdated: false,
        };
        this.generateOptionChainTable = this.generateOptionChainTable.bind(this);
    }

    componentDidMount() {
        this.generateOptionChainTable(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.generateOptionChainTable(nextProps);
    }

    generateOptionChainTable(props) {
        this.rows = [];
        _.forEach(props.data, (val, key) => {
            const { Call, Put, Strike } = val;
            this.rows.push(
                <tr key={key}>
                    <td>{Call && Call.PriceTypeBid !== 'Pending' ? Call.Bid : '-' }</td>
                    <td>{Call && Call.PriceTypeAsk !== 'Pending' ? Call.Ask : '-' }</td>
                    <td>{Call && Call.LastTraded ? Call.LastTraded : '-'}</td>
                    <td><em><b>{Strike}</b></em></td>
                    <td>{Put && Put.PriceTypeBid !== 'Pending' ? Put.Bid : '-' }</td>
                    <td>{Put && Put.PriceTypeAsk !== 'Pending' ? Put.Ask : '-'}</td>
                    <td>{Put && Put.LastTraded ? Put.LastTraded : '-'}</td>
                </tr>
            );
        });
        this.setState({ tableUpdated: !this.state.tableUpdated });
    }

    render() {
        return (

            <div>
                {
                    this.rows.length > 0 && (
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
                                    {this.rows}
                                </tbody>
                            </Table>
                        </Panel>)
                }
            </div>
        );
    }
}

OptionChainTemplate.propTypes = {
    data: PropTypes.array,
};

export default OptionChainTemplate;
