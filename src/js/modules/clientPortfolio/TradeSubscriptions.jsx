import React from 'react';
import {bindHandlers} from 'react-bind-handlers';
import _ from 'lodash';
import PropTypes from 'prop-types';

import * as API from '../../utils/api';
import CustomTable from '../../utils/CustomTable';
import CustomTableForPositions from '../../utils/CustomTableForPositions';

class TradeSubscriptions extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tradeUpdated: false
        }

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
        this.setState({
            tradeUpdated: false
        });

        let tradeType = this.props.tradeType;
        let apiName = `create${tradeType}Subscription`;

        const {AccountKey, ClientKey} = this.currentAccountInformation;

        let subscriptionArgs = {
            Arguments: {
                AccountKey,
                ClientKey,
                FieldGroups: this.props.fieldGroups
            }
        };
        this.disposeSubscription();
        this.tradeSubscription = API[apiName](subscriptionArgs, this.handleTradeUpdate);
    }

    handleTradeUpdate(response) {
        let data = response.Data;
        let tradeTypeId = this.tradeTypeId;
        this.setState({
            tradeUpdated: false
        });
        for (let index in data) {
            let tradeId = data[index][tradeTypeId];
            if (this.trades[tradeId]) {
                _.merge(this.trades[tradeId], data[index]);
            } else {
                this.trades[tradeId] = data[index];
            }
        }
        this.setState({
            tradeUpdated: true
        });
    }

    disposeSubscription() {
        if (_.isEmpty(this.tradeSubscription)) {
            return;
        }
        API.disposeIndividualSubscription(this.tradeSubscription);
        this.trades = {};
        this.tradeSubscription = {};
    }

    render() {
        return (
            <div>
                {
                    this.props.tradeType !== 'NetPosition' ? <CustomTable
                            data={this.trades}
                            keyField={this.tradeTypeId}
                            dataSortFields={['{this.tradeTypeId}']}
                            width={'150'}/> :
                        <CustomTableForPositions data={this.trades}/>
                }
            </div>
        )
    }
}

TradeSubscriptions.propTypes = {
    currentAccountInformation: PropTypes.object.isRequired,
    tradeType: PropTypes.string.isRequired,
    fieldGroups: PropTypes.array.isRequired
};

export default bindHandlers(TradeSubscriptions);
