import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import PositionDataTable from './positionDataTable';
import * as queries from '../modules/tradeSubscription/queries';

class Rows extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.posTrades = {};
        this.posTradeSubscription = {};
    }

    handleCollapse() {
        //  this.setState({ isOpen: !this.state.isOpen });
    }

    handlePositions(NpID) {
        const queryKey = {
            accountKey: 'YQ-l1tsux3RYD0WLgi1sbQ==',
            clientKey: 'YQ-l1tsux3RYD0WLgi1sbQ==',
        };

        queries.createSubscription(
            this.props,
            {
                accountKey: queryKey.accountKey,
                clientKey: queryKey.clientKey,
                fieldGroups: ['DisplayAndFormat', 'PositionBase', 'PositionView'],
                NetPositionId: NpID,
            },
            'Position',
            this.handlePositionTradeUpdate,
            (posTradeSubscription) => {
                this.posTradeSubscription = posTradeSubscription;
            }
        );
    }

    handlePositionTradeUpdate(response) {
        this.posTrades = queries.getUpdatedTrades(this.posTrades, 'PositionId', response.Data);

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
                            <Glyphicon className="glyph pull-right" onClick={this.handlePositions(this.props.value.NetPositionId)} glyph={classNames({
                                'chevron-down': !this.state.isOpen,
                                'chevron-up': this.state.isOpen,
                            })}
                            />
                        </td>

                    </tr>
                </tbody>
                {this.posTrades &&
                <PositionDataTable
                    positionDetails={this.posTrades}
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
