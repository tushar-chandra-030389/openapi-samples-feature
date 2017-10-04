import _ from 'lodash';
import { doWithLoader } from 'src/js/utils/global';
import { getInfoPrices, getInfoPricesList, subscribeInfoPrices, removeIndividualSubscription } from 'src/js/utils/api';

export function fetchInfoPrices(instrument, props, cb) {
    instrument.expiry = instrument.Expiry ? instrument.Expiry : instrument.FxForwardMaxForwardDate;
    doWithLoader(props, _.partial(getInfoPrices, props.accessToken, instrument), (result) => {
        cb(result.response);
    });
}

export function isSubscribed(selectedAssetTypes) {
    _.forEach(selectedAssetTypes, (value) => {
        if (value && value.subscription) {
            return true;
        }
    });
    for (const assetType in selectedAssetTypes) {
        if (selectedAssetTypes[assetType] && selectedAssetTypes[assetType].subscription) {
            return true;
        }
    }
    return false;
}

export function createSubscription(selectedAssetTypes, selectedInstruments, props, onPriceUpdate, cb) {
    _.forEach(selectedAssetTypes, (value, key) => {
        const uics = getUics(key, selectedInstruments);
        doWithLoader(
            props,
            _.partial(subscribeInfoPrices, props.accessToken, { Uics: uics, AssetType: key }, onPriceUpdate),
            (result) => {
                cb(result, key);
            }
        );
    });
}

export function removeSubscription(selectedAssetTypes, props, cb) {
    _.forEach(selectedAssetTypes, (value, key) => {
        if (value.subscription) {
            doWithLoader(
                props,
                _.partial(removeIndividualSubscription, props.accessToken, value.subscription),
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
