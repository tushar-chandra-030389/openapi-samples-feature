import { getData } from './dataServices';

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
