import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as queries from './queries';
import CustomTable from '../../components/customTable';
import CustomTableForPositions from '../../components/customTableForPositions';

class TradeSubscriptions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { tradeUpdated: false };
        this.trades = {};
        this.tradeSubscription = {};
        this.currentAccountInformation = {};
        this.tradeTypeId = `${this.props.tradeType}Id`;
    }

    componentWillReceiveProps(newProps) {
        if (!_.isEmpty(newProps.currentAccountInformation)) {
            this.currentAccountInformation = newProps.currentAccountInformation;
            this.createTradeSubscription();
        }
    }

    componentWillUnmount() {
        this.disposeSubscription();
    }

    createTradeSubscription() {
        this.setState({ tradeUpdated: false });
        this.disposeSubscription();
        queries.createSubscription(
            this.props,
            {
                accountKey: this.currentAccountInformation.AccountKey,
                clientKey: this.currentAccountInformation.ClientKey,
                fieldGroups: this.props.fieldGroups
            },
            this.props.tradeType,
            this.handleTradeUpdate,
            (tradeSubscription) => {
                this.tradeSubscription = tradeSubscription;
            }
        );
    }

    handleTradeUpdate(response) {
        let data = response.Data;
        this.setState({ tradeUpdated: false });
        this.trades = queries.getUpdatedTrades(this.trades, this.tradeTypeId, response.Data);
        this.setState({ tradeUpdated: true });
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
                    this.props.tradeType !== 'NetPosition' ? 
                    <CustomTable
                        data={this.trades}
                        keyField={this.tradeTypeId}
                        dataSortFields={['{this.tradeTypeId}']}
                        width={'150'}
                    /> :
                    <CustomTableForPositions data={this.trades}/>
                }
            </div>
        )
    }
}

export default bindHandlers(TradeSubscriptions);
