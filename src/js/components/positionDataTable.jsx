import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

class PositionDataTable extends React.PureComponent {

    netPositionTableArray() {
        return _.map(this.props.positionDetails, (value, key) => {
            if (value.NetPositionId === this.props.customKey) {
                return (
                    <tr key={key} className="table">
                        <td className="table-instrument">
                            {value.DisplayAndFormat.Symbol}
                        </td>
                        <td className="table-status">
                            {value.PositionBase.Status}
                        </td>
                        <td className="table-amount">
                            {value.PositionBase.Amount}
                        </td>

                        {value.PositionView ? <td className="table-exposure">
                            {value.PositionView.Exposure}
                        </td> : <td className="table-exposure"></td>}

                        {value.PositionView ? <td className="table-profit-loss">
                            {value.PositionView.ProfitLossOnTrade}
                        </td> : <td className="table-profit-loss"></td>}

                        {value.PositionView ? <td className="table-profit-loss-base">
                            {value.PositionView.ProfitLossOnTradeInBaseCurrency}
                        </td> : <td className="table-profit-loss-base"></td>}

                        <td className="table-price">
                            {value.PositionBase.OpenPrice}
                        </td>
                    </tr>
                );
            }
        });
    }

    render() {
        if (!_.isEmpty(this.props.positionDetails)) {
            return (
                <Collapse in={this.props.isOpen}>

                    <tbody className="show-positions">
                        {this.netPositionTableArray()}
                    </tbody>

                </Collapse>
            );
        }
    }
}

PositionDataTable
    .propTypes = {
        customKey: PropTypes.string,
        isOpen: PropTypes.bool,
        value: PropTypes.bool,
        positionDetails: PropTypes.object,
    };
export default bindHandlers(PositionDataTable);

