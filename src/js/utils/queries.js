import { doWithLoader } from 'src/js/utils/global';
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
