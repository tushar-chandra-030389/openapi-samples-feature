import { doWithLoader } from 'src/js/utils/global';
import * as API from 'src/js/utils/api';
import _ from 'lodash';

export function removeSubscription(fn, subscription, props, cb) {
    if (subscription) {
        doWithLoader(props, _.partial(API[fn], props.accessToken, subscription), (res) => cb(res));
    }
}

// eslint-disable-next-line max-params
export function createSubscription(fn, props, onPriceUpdate, cb, onRequestError, paramObj) {
    doWithLoader(props, _.partial(API[fn], props.accessToken, paramObj, onPriceUpdate, onRequestError), (res) => cb(res));
}

export function batchExpiries(dataExpiries, createdExpiries) {
    _.forEach(dataExpiries, (value) => {
        const { Strikes } = value;
        if (Strikes) {
            const strikeArr = [];
            _.forEach(Strikes, (val) => {
                if (val.Call) {
                    strikeArr.push(val);
                }
            });

            const expiryDate = new Date(value.Expiry).toString();

            // this is for checking if the record is previously present inside this.expiries
            _.remove(createdExpiries, { expiryDate });

            const obj = {
                expiryDate,
                strikeArr,
            };
            createdExpiries.push(obj);
        }
    });
    return createdExpiries;
}
