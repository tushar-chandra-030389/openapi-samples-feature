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
        this.postTradeSubscription = {};
        this.currentAccountInformation = {};
        this.tradeTypeId = `${this.props.tradeType}Id`;
        this.onlyPositionData = {};
        //this.combinedPositionData = [];
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
                fieldGroups: this.props.fieldGroups,
            },
            this.props.tradeType,
            this.handleTradeUpdate,
            (tradeSubscription) => {
                this.tradeSubscription = tradeSubscription;
            }
        );
        queries.createSubscription(
            this.props,
            {
                accountKey: this.currentAccountInformation.AccountKey,
                clientKey: this.currentAccountInformation.ClientKey,
                fieldGroups: ["DisplayAndFormat", "PositionBase", "PositionView"],
            },
            "Position",
            this.handleTradeUpdate1,
            (postTradeSubscription) => {
                this.postTradeSubscription = postTradeSubscription;
            }
        );
    }

    handleTradeUpdate(response) {
        this.setState({ tradeUpdated: false });
        this.trades = queries.getUpdatedTrades(this.trades, this.tradeTypeId, response.Data);
        //console.log('Net positions Data',this.trades);
        this.setState({ tradeUpdated: true });
        //console.log('Accessible Positions Data',this.postrades);
        _.map(this.trades, (value, key) => {
            var NetPositionId = value.NetPositionId;
            let combinedPositionData = [];
            _.map(this.postrades , (value,key) => {
                if(NetPositionId === value.NetPositionId){
                    combinedPositionData.push(value);
                }
            });
            this.onlyPositionData[NetPositionId] = combinedPositionData;
            combinedPositionData = [];
            //console.log('this onlyPositionData with object',this.onlyPositionData);
        })

    }
    handleTradeUpdate1(response) {
        this.postrades = queries.getUpdatedTrades(this.postrades,"PositionId", response.Data);
        //console.log('Positions Data',this.postrades);
    }
    disposeSubscription() {
        if (!_.isEmpty(this.tradeSubscription)) {
            queries.unSubscribe(this.props, this.tradeSubscription, () => {
                this.trades = {};
                this.tradeSubscription = {};
            });
        }

        if (!_.isEmpty(this.postTradeSubscription)) {
            queries.unSubscribe(this.props, this.postTradeSubscription, () => {
                this.postrades = {};
                this.postTradeSubscription = {};
            });
        }
    }

    render() {

        return (
            <div>
                {
                    this.props.tradeType === 'NetPosition' ?
                        <CustomTableForPositions data={this.trades} onlyPositionData={this.onlyPositionData} /> :
                        <CustomTable
                            data={this.trades}
                            keyField={this.tradeTypeId}
                            dataSortFields={['{this.tradeTypeId}']}
                            width={'150'}
                        />
                }
            </div>
        );
    }
}

TradeSubscriptions.propTypes = {
    tradeType: PropTypes.string,
    fieldGroups: PropTypes.array,
};

export default bindHandlers(TradeSubscriptions);
