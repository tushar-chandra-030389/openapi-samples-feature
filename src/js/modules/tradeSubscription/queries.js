import { doWithLoader ,doWithLoaderAll} from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function unSubscribe(props, subscription, cb) {
    doWithLoader(props, _.partial(API.removeIndividualSubscription, props.accessToken, subscription), () => cb());
}

export function createSubscription(props, subscriptionArgs, tradeType, onUpdate, cb) {
    doWithLoader(
        props,
        _.partial(API[`create${tradeType}Subscription`], props.accessToken, subscriptionArgs, onUpdate),
        (result) => cb(result)
    );
}
export function createSubscriptionAll(props, subscriptionArgs,subscriptionArgs1, tradeType,tradeType1, onUpdate,onUpdate1, cb,cb1) {
    doWithLoaderAll(
        props,
        _.partial(API[`create${tradeType}Subscription`], props.accessToken, subscriptionArgs, onUpdate),
        _.partial(API[`create${tradeType1}Subscription`], props.accessToken, subscriptionArgs1, onUpdate1),
        (result) => cb(result),
        (result) => cb1(result)

    );
}

export function getUpdatedTrades(currTrades, tradeTypeId, updatedTrades) {
    _.forEach(updatedTrades, (value, index) => {
        const tradeId = updatedTrades[index][tradeTypeId];
        if (currTrades[tradeId]) {
            _.merge(currTrades[tradeId], updatedTrades[index]);
        } else {
            currTrades[tradeId] = updatedTrades[index];
        }
    });

    // for (const index in updatedTrades) {
    //     const tradeId = updatedTrades[index][tradeTypeId];
    //     if (currTrades[tradeId]) {
    //         _.merge(currTrades[tradeId], updatedTrades[index]);
    //     } else {
    //         currTrades[tradeId] = updatedTrades[index];
    //     }
    // }
    return currTrades;
}
