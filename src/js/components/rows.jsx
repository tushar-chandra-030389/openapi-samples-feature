import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import PositionDataTable from './positionDataTable';

class Rows extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    handleCollapse() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const { NetPositionView, NetPositionBase } = this.props.value;
        return (
            <table>
                <tbody>
                    <tr onClick={this.handleCollapse} className="net-position-row" >
                        <td className="table-instrument">
                            {this.props.index}</td>
                        <td className="table-status">
                            {NetPositionView.Status}
                        </td>
                        <td className="table-amount">
                            {NetPositionBase.Amount}
                        </td>
                        <td className="table-exposure">
                            {NetPositionView.Exposure}
                        </td>
                        <td className="table-profit-loss">
                            {NetPositionView.ProfitLossOnTrade}
                        </td>
                        <td className="table-profit-loss-base">
                            {NetPositionView.ProfitLossOnTradeInBaseCurrency}
                        </td>
                        <td className="table-price">
                            {NetPositionView.AverageOpenPrice}
                        </td>
                        <td>
                            <Glyphicon className="glyph pull-right" glyph={classNames({
                                'chevron-down': !this.state.isOpen,
                                'chevron-up': this.state.isOpen,
                            })}
                            />
                        </td>

                    </tr>
                </tbody>
                {this.props.positionDetails &&
                <PositionDataTable
                    positionDetails={this.props.positionDetails}
                    isOpen={this.state.isOpen}
                    customKey={this.props.value.NetPositionId}
                />}
            </table>
        );
    }
}

Rows
    .propTypes = {
        index: PropTypes.string,
        value: PropTypes.object,
        positionDetails: PropTypes.object,
    };

export default bindHandlers(Rows);
