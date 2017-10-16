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
        this.tradeSubscription = {};
        this.currentAccountInformation = this.props.currentAccountInformation;
        this.tradeAccountSubscribed = this.currentAccountInformation.AccountId;
        this.tradeTypeId = `${this.props.tradeType}Id`;
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

    // this function handles continuous data streams from websocket.
    handleTradeUpdate(response) {
        this.trades = queries.getUpdatedTrades(this.trades, this.tradeTypeId, response.Data);
        this.setState({ tradeUpdated: !this.state.tradeUpdated });
    }

    createTradeSubscription() {

        // dispose any residual subscriptions.
        this.disposeSubscription();

        queries.createSubscription(
            this.props,
            {
                accountKey: this.currentAccountInformation.AccountKey,
                clientKey: this.currentAccountInformation.ClientKey,
                fieldGroups: this.props.fieldGroups,
            },
            this.props.tradeType,
            this.handleTradeUpdate,
            (tradeSubscription) => {

                // this is executed when subscription request is successful and
                // we need to set local properties to the subscribed entity.
                this.tradeSubscription = tradeSubscription;
                this.tradeAccountSubscribed = this.currentAccountInformation.AccountId;
            }
        );
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
                        <CustomTableForPositions data={this.trades}/> :
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
