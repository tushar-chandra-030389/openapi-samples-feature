import { doWithLoader } from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function getInfo(fn, props, callBack, param1, param2) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, param1, param2), (result) => {
        callBack(result.response);
    });
}

export function removeSubscription(fn, subscription, props, cb) {
    if (subscription) {
        doWithLoader(props, _.partial(API[fn], props.accessToken, subscription), (res) => cb(res));
    }
}

// eslint-disable-next-line max-params
export function createSubscription(fn, props, onPriceUpdate, cb, onRequestError, paramObj) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, paramObj, onPriceUpdate, onRequestError), (res) => cb(res));
}
