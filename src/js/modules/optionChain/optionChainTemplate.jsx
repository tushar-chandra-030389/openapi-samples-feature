import React from 'react';
import { Table, Panel } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

function OptionChainTemplate(props) {
    const rows = [];
    _.forOwn(props.data, (val, key) => {
        if (val[0] && val[1]) {
            rows.push(
                <tr key={key}>
                    <td>{val[0].Uic}</td>
                    <td>{val[0].UnderlyingUic}</td>
                    <td><em><b>{key}</b></em></td>
                    <td>{val[1].UnderlyingUic}</td>
                    <td>{val[1].Uic}</td>
                </tr>
            );
        }
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
                                    <th>Uic</th>
                                    <th>UnderLyingUic</th>
                                    <th><em>StrikePrice</em></th>
                                    <th>UnderLyingUic</th>
                                    <th>Uic</th>
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
    data: PropTypes.object,
};

export default OptionChainTemplate;
