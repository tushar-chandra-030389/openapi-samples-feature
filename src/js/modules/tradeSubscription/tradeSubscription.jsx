import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as queries from './queries';
import CustomTable from 'src/js/components/customTable';
import CustomTableForPositions from 'src/js/components/customTableForPositions';

class TradeSubscriptions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { tradeUpdated: false };
        this.trades = {};
        this.postrades = {};
        this.tradeSubscription = {};
        this.currentAccountInformation = this.props.currentAccountInformation;
        this.tradeAccountSubscribed = this.currentAccountInformation.AccountId;
        this.tradeTypeId = `${this.props.tradeType}Id`;
        this.positionDetails = {};
        this.posTradeSubscription = {};
    }

    // this function is for fetching subscription on first load.
    componentDidMount() {
        this.createTradeSubscription();
    }

    // this is for handling account reselection.
    componentWillReceiveProps(newProps) {
        this.currentAccountInformation = newProps.currentAccountInformation;
        if (this.tradeAccountSubscribed !== this.currentAccountInformation.AccountId) {
            this.createTradeSubscription();
        }
    }

    // subscriptions need to be destroyed while navigating away from pages.
    componentWillUnmount() {
        this.disposeSubscription();
    }

    createTradeSubscription() {
        this.disposeSubscription();
        const queryKey = {
            accountKey: this.currentAccountInformation.AccountKey,
            clientKey: this.currentAccountInformation.ClientKey,

        };
        const tradingType = {
            Order: 'Order',
            Position: 'Position',
            NetPosition: 'NetPosition',
        };
        if (this.props.tradeType === tradingType.Order || this.props.tradeType === tradingType.Position) {

            queries.createSubscription(
                this.props,
                {
                    accountKey: queryKey.accountKey,
                    clientKey: queryKey.clientKey,
                    fieldGroups: this.props.fieldGroups,
                },
                this.props.tradeType,
                this.handleTradeUpdate,
                (tradeSubscription) => {
                    this.tradeSubscription = tradeSubscription;
                    this.tradeAccountSubscribed = this.currentAccountInformation.AccountId;
                }
            );
        }
        if (this.props.tradeType === tradingType.NetPosition) {
            const params = {
                'props': this.props,
                'netPositionTradeType': this.props.tradeType,
                'positionTradeType': tradingType.Position,
                'netPositionTradeCallBack': this.handleTradeUpdate,
                'positionCallBack': this.handlePositionTradeUpdate,
            };
            queries.createSubscriptionAll(
                {
                    accountKey: queryKey.accountKey,
                    clientKey: queryKey.clientKey,
                    fieldGroups: this.props.fieldGroups,
                },
                {
                    accountKey: queryKey.accountKey,
                    clientKey: queryKey.clientKey,
                    fieldGroups: ['DisplayAndFormat', 'PositionBase', 'PositionView'],
                },
                params,
                (tradeSubscription) => {
                    this.tradeSubscription = tradeSubscription;
                    this.tradeAccountSubscribed = this.currentAccountInformation.AccountId;
                },
                (posTradeSubscription) => {
                    this.posTradeSubscription = posTradeSubscription;
                }
            );
        }

    }

    handleTradeUpdate(response) {
        this.trades = queries.getUpdatedTrades(this.trades, this.tradeTypeId, response.Data);
        this.setState({ tradeUpdated: !this.state.tradeUpdated });
    }

    handlePositionTradeUpdate(response) {
        this.postrades = queries.getUpdatedTrades(this.postrades, 'PositionId', response.Data);
        if (!_.isEmpty(this.postrades)) {
            this.positionDetails = _.reduce(this.trades, (result, value) => {

                const NetPositionId = value.NetPositionId;
                const positions = [];
                const positionData = _.map(this.postrades, (valuePostTrades) => {
                    if (NetPositionId === valuePostTrades.NetPositionId) {
                        positions.push(valuePostTrades);
                    }

                    return positionData;
                });
                result[NetPositionId] = positions;
                return result;
            }, {});

        }
    }

    disposeSubscription() {
        if (!_.isEmpty(this.tradeSubscription)) {
            queries.unSubscribe(this.props, this.tradeSubscription, () => {
                this.trades = {};
                this.tradeSubscription = {};
            });
        }

        if (!_.isEmpty(this.posTradeSubscription)) {
            queries.unSubscribe(this.props, this.posTradeSubscription, () => {
                this.postrades = {};
                this.posTradeSubscription = {};
            });
        }
    }

    render() {
        return (
            <div>
                {
                    !_.isEmpty(this.trades) &&
                    (this.props.tradeType === 'NetPosition' ?
                        <CustomTableForPositions data={this.trades} positionDetails={this.positionDetails}/> :
                        <CustomTable
                            data={this.trades}
                            keyField={this.tradeTypeId}
                            dataSortFields={['{this.tradeTypeId}']}
                            width={'150'}
                            showUpdateAnim
                        />)
                }
            </div>
        );
    }
}

TradeSubscriptions.propTypes = {
    tradeType: PropTypes.string,
    fieldGroups: PropTypes.array,
    currentAccountInformation: PropTypes.object,
};

export default bindHandlers(TradeSubscriptions);
