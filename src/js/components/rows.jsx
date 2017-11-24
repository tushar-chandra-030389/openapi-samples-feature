import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import PositionDataTable from './positionDataTable';
import * as queries from 'src/js/modules/tradeSubscription/queries';
import { subscribeBatch, unSubscribeBatch } from 'src/js/utils/queries';

class Rows extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            positionTradeUpdated: false,
        };
        this.posTrades = {};
        this.posTradeSubscription = {};
    }

    // subscriptions need to be destroyed while navigating away from pages.
    componentWillUnmount() {
        this.disposeSubscription();
    }

    createTradeSubscription(NpID) {
        const { AccountKey, ClientKey } = this.props.currentAccountInformation;
        subscribeBatch(
            'createPositionSubscription',
            this.props,
            {
                accountKey: AccountKey,
                clientKey: ClientKey,
                fieldGroups: ['DisplayAndFormat', 'PositionBase', 'PositionView'],
                NetPositionId: NpID,
            },
            this.handlePositionTradeUpdate,
            (posTradeSubscription) => {
                this.posTradeSubscription = posTradeSubscription;
            }
        );
    }

    handlePositions(NpID) {
        this.disposeSubscription();
        this.setState({ isOpen: !this.state.isOpen });
        if (!this.state.isOpen) {
            this.createTradeSubscription(NpID);
        }
    }

    disposeSubscription() {
        if (!_.isEmpty(this.posTradeSubscription)) {
            unSubscribeBatch(this.props, this.posTradeSubscription, () => {
                this.posTrades = {};
                this.posTradeSubscription = {};
            });
        }
    }

    handlePositionTradeUpdate(response) {
        this.posTrades = queries.getUpdatedTrades(this.posTrades, 'PositionId', response.Data);
        this.setState({ positionTradeUpdated: !this.state.positionTradeUpdated });
    }

    render() {
        const { NetPositionView, NetPositionBase } = this.props.value;
        return (
            <table>
                <tbody>
                    <tr onClick={_.partial(this.handlePositions, this.props.value.NetPositionId)} className="net-position-row">
                        <td className="table-instrument">
                            {this.props.index}
                        </td>
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

                {!_.isEmpty(this.posTrades) &&
                <PositionDataTable
                    positionDetails={this.posTrades}
                    isOpen={this.state.isOpen}
                    customKey={this.props.value.NetPositionId}
                />}
            </table>
        );
    }
}

Rows.propTypes = {
    index: PropTypes.string,
    value: PropTypes.object,
    positionDetails: PropTypes.object,
    currentAccountInformation: PropTypes.object,
};

export default bindHandlers(Rows);
