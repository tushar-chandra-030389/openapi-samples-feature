import { doWithLoader, setGlobalErrMessage } from 'src/js/utils/global';
import * as API from 'src/js/utils/apiServices/api';
import _ from 'lodash';

export function fetchInfo(fn, props, params, callBack) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, params), (result) => {
        callBack(result.response);
    });
}

export function unSubscribeBatch(props, subscription, cb) {
    if (!_.isEmpty(subscription)) {
        doWithLoader(props, _.partial(API.removeIndividualSubscriptionBatch, props.accessToken, subscription), (result) => cb(result));
    }
}
export function subscribePriceBatch(props, instrument, onPriceUpdate, cb) {
    const { AssetType, Uic } = instrument;
    const instrumentData = { AssetType, Uic };

    if (instrument.Expiry && instrument.PutCall) {
        instrumentData.expiryDate = instrument.Expiry;
        instrumentData.PutCall = instrument.PutCall;
    }
    subscribeBatch('subscribePricesBatch', props, instrumentData, onPriceUpdate, cb);
}

export function subscribeBatch(fn, props, subscriptionArgs, onUpdate, cb) {
    doWithLoader(
        props,
        _.partial(API[fn], props.accessToken, subscriptionArgs, onUpdate, setGlobalErrMessage.bind(null, props)),
        (result) => cb(result)
    );
}

