import _ from 'lodash';
import { getInfoPrices, placeOrder, getAccountInfo } from 'src/js/utils/api';
import { doWithLoader } from 'src/js/utils/global';

export function getAskBidFormData(instrumentInfo, currentOrder) {
    const askPrice = instrumentInfo ? instrumentInfo.Quote.Ask : 0.0;
    const bidPrice = instrumentInfo ? instrumentInfo.Quote.Bid : 0.0;
    const symbol = instrumentInfo ? instrumentInfo.DisplayAndFormat.Symbol : '';
    return [{
        label: `Instrument (UIC: ${currentOrder.Uic})`,
        value: symbol,
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'AssetType',
        value: currentOrder.AssetType,
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'AskPrice',
        value: askPrice,
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'BidPrice',
        value: bidPrice,
        componentClass: 'text',
        readOnly: 'true',
    },
    ];
}

export function getBuySellFormData(currentOrder) {
    return [{
        label: 'BuySell',
        value: ['Buy', 'Sell'],
        componentClass: 'select',
    },
    {
        label: 'OrderPrice',
        value: currentOrder.OrderPrice,
        componentClass: 'text',
    },
    {
        label: 'OrderAmount',
        value: currentOrder.Amount,
        componentClass: 'text',
    },
    ];
}

export function orderTypeDurationFormData(supportedOrderTypes) {
    return [{
        label: 'OrderType',
        value: supportedOrderTypes,
        componentClass: 'select',
    },
    {
        label: 'OrderDuration',
        value: ['DayOrder', 'GoodTillCancel', 'ImmediateOrCancel'],
        componentClass: 'select',
    },
    ];
}

export function openCloseFormData() {
    return [{
        label: 'ToOpenClose',
        value: ['ToOpen', 'ToClose'],
        componentClass: 'select',
    }];
}

export function takeProfitFormData(takeProfitPrice) {
    return [{
        label: 'TakeProfit-OrderType',
        value: 'Limit',
        componentClass: 'text',
        readOnly: 'true',
    },
    {
        label: 'TakeProfitPrice',
        value: takeProfitPrice,
        componentClass: 'text',
    },
    ];
}

export function stopLossFormData(stopLossPrice) {
    return [{
        label: 'StopLoss-OrderType',
        value: ['StopIfTraded', 'TrailingStopIfTraded', 'StopLimit'],
        componentClass: 'select',
    },
    {
        label: 'StopLossPrice',
        value: stopLossPrice,
        componentClass: 'text',
    },
    ];
}

export function getUpdatedValues(event, order, ask, bid) {
    const value = event.target.value;
    switch (event.target.id) {
        case 'BuySell':
            order.currentOrder.BuySell = value;
            order.currentOrder.OrderPrice = order.currentOrder.BuySell === 'Buy' ? ask : bid;
            break;

        case 'OrderDuration':
            order.currentOrder.OrderDuration.DurationType = value;
            break;

        case 'OrderAmount':
            order.currentOrder.Amount = value;
            break;

        case 'OrderPrice':
            order.currentOrder.OrderPrice = value;
            break;

        case 'Account':
            order.currentOrder.AccountKey = value;
            break;

        case 'ToOpenClose':
            order.currentOrder.ToOpenClose = value;
            break;

        case 'OrderType':
            order.currentOrder.OrderType = value;
            break;

        case 'TakeProfitPrice':
            order.takeProfitPrice = value;
            break;

        case 'StopLossPrice':
            order.stopLossPrice = value;
            break;

        case 'StopLoss-OrderType':
            order.stopLossOrderType = value;
            break;

        default:
            break;
    }
    return order;
}

export function getRelatedOrder(orderType, orderPrice, currentOrder) {
    return {
        Uic: currentOrder.Uic,
        AssetType: currentOrder.AssetType,
        OrderType: orderType,
        OrderPrice: orderPrice,
        OrderDuration: currentOrder.OrderDuration,
        Amount: currentOrder.Amount,
        AccountKey: currentOrder.AccountKey,
        BuySell: currentOrder.BuySell === 'Buy' ? 'Sell' : 'Buy',

        /* possible order relations
            IfDoneMaster   -   If Done Orders is a combination of an entry order and conditional orders
                                If the order is filled, then a (slave) stop loss, limit or trailing stop
                                will automatically be attached to the new open position
            IfDoneSlave    -   If Done Orders is a combination of an entry order and conditional orders
                                If the order is filled, then a (slave) stop loss, limit or trailing stop
                                will automatically be attached to the new open position
            IfDoneSlaveOco -   Slave order with OCO. See OCO.
            Oco            -   One-Cancels-the-Other Order (OCO). A pair of orders stipulating that if
                                one order is executed, then the other order is automatically canceled
            StandAlone     -   No relation to other order
        */
        OrderRelation: 'IfDoneMaster',
        ToOpenClose: 'ToClose',
    };
}

export function fetchInfoPrices(instrument, props, cb) {
    instrument.expiry = instrument.Expiry ? instrument.Expiry : instrument.FxForwardMaxForwardDate;
    doWithLoader(props, _.partial(getInfoPrices, props.accessToken, instrument), (result) => cb(result.response));
}

export function postOrder(order, props, cb) {
    doWithLoader(props, _.partial(placeOrder, props.accessToken, order), (result) => cb(result.response));
}

export function fetchAccountInfo(props, cb) {
    doWithLoader(props, _.partial(getAccountInfo, props.accessToken), (result) => cb(result.response));
}

export function getAccountArray(accountInfo) {
    return _.reduce(accountInfo.Data, (result, value) => {
        result.push(value);
        return result;
    }, []);
}
