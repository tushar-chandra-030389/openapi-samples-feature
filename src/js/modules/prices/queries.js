import _ from 'lodash';
import { doWithLoader, setGlobalErrMessage } from 'src/js/utils/global';
import { subscribePrices, removeIndividualSubscription } from 'src/js/utils/api';

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
    const { AssetType, Uic } = instrument;
    const instrumentData = { AssetType, Uic };

    if (instrument.Expiry && instrument.PutCall) {
        instrumentData.expiryDate = instrument.Expiry;
        instrumentData.PutCall = instrument.PutCall;
    }
    doWithLoader(
        props,
        _.partial(
            subscribePrices,
            props.accessToken,
            instrumentData,
            onPriceUpdate,
            setGlobalErrMessage.bind(null, props)),
        (result) => cb(result)
    );
}
