import { doWithLoader, setGlobalErrMessage } from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function fetchInfo(fn, props, params, callBack) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, params), (result) => {
        callBack(result.response);
    });
}

export function unSubscribe(props, subscription, cb) {
    if (!_.isEmpty(subscription)) {
        doWithLoader(props, _.partial(API.removeIndividualSubscription, props.accessToken, subscription), (result) => cb(result));
    }
}

export function subscribePrices(props, instrument, onPriceUpdate, cb) {
    const { AssetType, Uic } = instrument;
    const instrumentData = { AssetType, Uic };

    if (instrument.Expiry && instrument.PutCall) {
        instrumentData.expiryDate = instrument.Expiry;
        instrumentData.PutCall = instrument.PutCall;
    }

    doWithLoader(
        props,
        _.partial(API.subscribePrices,
            props.accessToken,
            instrumentData,
            onPriceUpdate,
            setGlobalErrMessage.bind(null, props)),
        (result) => cb(result)
    );
}

export function subscribe(fn, props, subscriptionArgs, onUpdate, cb) {
    doWithLoader(
        props,
        _.partial(API[fn], props.accessToken, subscriptionArgs, onUpdate, setGlobalErrMessage.bind(null, props)),
        (result) => cb(result)
    );
}

