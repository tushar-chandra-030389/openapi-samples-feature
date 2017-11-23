import _ from 'lodash';
import { doWithLoader, checkIfPutCallExpiry } from 'src/js/utils/global';
import {
    getInfoPrices,
    getInfoPricesList,
    subscribeInfoPricesBatch,
    removeIndividualSubscriptionBatch
} from 'src/js/utils/apiServices/api';

export function fetchInfoPrices(instrument, props, cb) {
    const { AssetType, Uic } = instrument;
    const instrumentData = { AssetType, Uic };

    if (instrument.Expiry && instrument.PutCall) {
        instrumentData.expiryDate = instrument.Expiry;
        instrumentData.PutCall = instrument.PutCall;
    }
    doWithLoader(props, _.partial(getInfoPrices, props.accessToken, instrumentData), (result) => {
        cb(result.response);
    });
}

export function isSubscribed(selectedAssetTypes) {
    for (const assetType in selectedAssetTypes) {
        if (selectedAssetTypes[assetType] && selectedAssetTypes[assetType].subscription) {
            return true;
        }
    }
    return false;
}

export function createSubscription(selectedAssetTypes, selectedInstruments, props, onPriceUpdate, cb) {

    // for each type of selected asset, we need to generate subscription
    _.forEach(selectedAssetTypes, (value, key) => {
        const uics = getUics(key, selectedInstruments);

        const args = {
            Uics: uics,
            AssetType: key,
        };

        // as of now we are not sending requests for fxvanilla, fxnotouch, fxonetouch
        if (checkIfPutCallExpiry(key)) {
            props.setErrMessage('Subscriptions to fxvanilla, fxonetouch, fxnotouch options are unavailable.' +
                ' Other instruments will be subscribed');
        } else {
            doWithLoader(
                props,
                _.partial(subscribeInfoPricesBatch, props.accessToken, args, onPriceUpdate),
                (result) => {
                    cb(result, key);
                }
            );
        }
    });
}

export function removeSubscription(selectedAssetTypes, props, cb) {
    _.forEach(selectedAssetTypes, (value, key) => {
        if (value.subscription) {
            doWithLoader(
                props,
                _.partial(removeIndividualSubscriptionBatch, props.accessToken, value.subscription),
                () => cb(key)
            );
        }
    });
}

export function fetchInfoPriceList(selectedAssetTypes, selectedInstruments, props, cb) {
    _.forEach(selectedAssetTypes, (value, key) => {
        const uics = getUics(key, selectedInstruments);
        doWithLoader(
            props,
            _.partial(getInfoPricesList, props.accessToken, { Uics: uics, AssetType: key }),
            (result) => {
                cb(result.response);
            }
        );
    });
}

function getUics(assetType, selectedInstruments) {
    let uics = '';
    _.forEach(selectedInstruments, (value, key) => {
        if (value.AssetType && value.AssetType === assetType) {
            if (uics === '') {
                uics = `${key}`;
            } else {
                uics = `${key},${uics}`;
            }
        }
    });
    return uics;
}

