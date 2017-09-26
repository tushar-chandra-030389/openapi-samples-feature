import _ from 'lodash';
import { doWithLoader } from '../../utils/global';
import { getInfoPrices, getInfoPriceList, subscribeInfoPrices, removeIndividualSubscription } from '../../utils/api';

export function fetchInfoPrices(instrument, props, cb) {
    const expiry = instrument.Expiry ? instrument.Expiry : instrument.FxForwardMaxForwardDate;
    doWithLoader(props, _.partial(getInfoPrices, props.accessToken, instrument), (result) => {
        cb(result.response);
    });
}

export function isSubscribed(selectedAssetTypes) {
    for (var assetType in selectedAssetTypes) {
        if (selectedAssetTypes[assetType] && selectedAssetTypes[assetType].subscription) {
            return true;
        }
    }
    return false;
}

export function createSubscription(selectedAssetTypes, selectedInstruments, props, onPriceUpdate, cb) {
    for (let assetType in this.selectedAssetTypes) {
        let uics = _getUics(assetType, selectedInstruments);
        doWithLoader(
            props,
            _.partial(subscribeInfoPrices, props.accessToken, { Uics: uics, AssetType: assetType }, onPriceUpdate),
            (result) => {
                cb(result.response, assetType);
            }
        );
    }
}

export function removeSubscription(selectedAssetTypes, props, cb) {
    for (let assetType in selectedAssetTypes) {
        if (selectedAssetTypes[assetType].subscription) {
            doWithLoader(
                props,
                _.partial(removeIndividualSubscription, props.accessToken, selectedAssetTypes[assetType].subscription),
                () => cb()
            )
        }
    }
}

export function fetchInfoPriceList(selectedAssetTypes, selectedInstruments, props, cb) {
    for(var assetType in selectedAssetTypes) {
        let uics = _getUics(assetType, selectedInstruments);
        doWithLoader(
            props,
            _.partial(getInfoPriceList, props.accessToken, { Uics: uics, AssetType: assetType }),
            (result) => {
                cb(result.response);
            }
        );
    }
}

function _getUics(assetType, selectedInstruments) {
    let uics = '';
    for (let uic in selectedInstruments) {
        if (selectedInstruments[uic].AssetType === assetType) {
            if (uics !== '') {
                uics = `${uic},${uics}`;
            } else {
                uics = `${uic}`;
            }
        }
    }
    return uics;
}
