import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as queries from './queries';
import CustomTable from 'src/js/components/customTable';
import CustomTableForPositions from 'src/js/components/customTableForPositions';
import { TRADE_TYPE } from 'src/js/utils/constants';

class TradeSubscriptions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { tradeUpdated: false };
        this.trades = {};
        this.posTrades = {};
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

        if (this.props.tradeType === TRADE_TYPE.ORDER || this.props.tradeType === TRADE_TYPE.NETPOSITION) {
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
    }

    handleTradeUpdate(response) {
        this.trades = queries.getUpdatedTrades(this.trades, this.tradeTypeId, response.Data);
        this.setState({ tradeUpdated: !this.state.tradeUpdated });
    }

    disposeSubscription() {
        if (!_.isEmpty(this.tradeSubscription)) {
            queries.unSubscribe(this.props, this.tradeSubscription, () => {
                this.trades = {};
                this.tradeSubscription = {};
            });
        }
    }

    render() {
        return (
            <div>
                {
                    !_.isEmpty(this.trades) &&
                    (this.props.tradeType === 'NetPosition' ?
                        <CustomTableForPositions {...this.props} data={this.trades}/> :
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
