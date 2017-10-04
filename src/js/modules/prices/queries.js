import _ from 'lodash';
import { doWithLoader } from '../../utils/global';
import { subscribePrices, removeIndividualSubscription } from '../../utils/api';

export function removeSubscription(subscription, props, cb) {
    if (subscription) {
        doWithLoader(
            props,
            _.partial(removeIndividualSubscription, props.accessToken, subscription),
            () => cb()
        );
    }
}

export function createSubscription(instrument, props, onPriceUpdate, cb) {
    doWithLoader(
        props,
        _.partial(subscribePrices, props.accessToken, { AssetType: instrument.AssetType, Uic: instrument.Uic }, onPriceUpdate),
        (result) => cb(result)
    );
}
