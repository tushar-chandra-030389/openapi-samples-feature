import { getData, formatPrice } from './dataServices';

//fetches user data from openapi/port/v1/users/me
export function getUserDetails(accessToken) {
    return getData({
        serviceGroup: 'port',
        endPoint: 'v1/users/me',
        accessToken,
    });
}

// fetch instruments from client lib based on AssetType
// eg: Query Params : { AssetType: 'FxSpot' }
export function getInstruments(accessToken, assetTypes) {
    return getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments',
        queryParams: { AssetTypes: assetTypes },
        accessToken,
    });
}

// fetch instrument details from client lib based on Uic and AssetType
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInstrumentDetails(accessToken, uic, assetTypes) {
    return getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments/details/{Uic}/{AssetType}',
        queryParams: {
            Uic: uic,
            AssetType: assetTypes,
        },
        accessToken,
    });
};

// fetch Info Prices for a particular instrument based on AssetType and Uic
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInfoPrices(accessToken, instrumentDetails) {
    return getData({
        serviceGroup: 'trade',
        endPoint: 'v1/infoprices',
        queryParams: {
            AssetType: instrumentDetails.AssetType,
            Uic: instrumentDetails.Uic,
            ExpiryDate: instrumentDetails.ExpiryDate,
            PutCall: instrumentDetails.PutCall,
            FieldGroups: [
                'DisplayAndFormat',
                'InstrumentPriceDetails',
                'MarketDepth',
                'PriceInfo',
                'PriceInfoDetails',
                'Quote',
            ],
        },        
        accessToken,
    });
}

// fetch option chain based on AssetType
// eg: Query Params : { OptionRootId: 19 }
export function getOptionChain(accessToken, optionId) {
    return getData({
        serviceGroup: 'ref',
        endPoint: `v1/instruments/contractoptionspaces/${optionId}`,
        queryParams: null,
        accessToken,
    });
}

export function getFormattedPrice(price, decimal, formatFlags) {
    return formatPrice(price, decimal, formatFlags);
}

export function getOptionRootData(accessToken, rootId) {
    return getData({
        serviceGroup: 'ref',
        endPoint: 'v1/instruments/contractoptionspaces',
        queryParams: { OptionRootId: rootId },
        accessToken,
    });
}
