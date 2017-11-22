import { fetchDataQuery, subscriptionQuery, formatQuery, disposeQuery, postQuery } from './queries';

// fetches user data from openapi/port/v1/users/me
export function getUserDetails(accessToken) {
    return fetchDataQuery(
        'port',
        'v1/users/me',
        null, // for queryParams
        accessToken
    );
}

// fetch instruments from client lib based on AssetType
// eg: Query Params : { AssetType: 'FxSpot' }
export function getInstruments(accessToken, params) {
    const { AssetTypes, keyword } = params;
    return fetchDataQuery(
        'ref',
        'v1/instruments',
        { AssetTypes, Keywords: keyword },
        accessToken
    );
}

// fetch instrument details from client lib based on Uic and AssetType
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInstrumentDetails(accessToken, instrument) {
    const { Uic, AssetType, ExpiryDate, PutCall } = instrument;
    return fetchDataQuery(
        'ref',
        'v1/instruments/details/{Uic}/{AssetType}',
        {
            Uic,
            AssetType,
            ExpiryDate,
            PutCall,
        },
        accessToken
    );
}

// fetch Account details
export function getAccountInfo(accessToken) {
    return fetchDataQuery(
        'port',
        'v1/accounts/me',
        null,
        accessToken
    );
}

// fetch Info Prices for a particular instrument based on AssetType and Uic
// eg: Query Params : { AssetType: 'FxSpot', Uic: 21 }
export function getInfoPrices(accessToken, instrumentDetails) {
    return fetchDataQuery(
        'trade',
        'v1/infoprices',
        {
            AssetType: instrumentDetails.AssetType,
            Uic: instrumentDetails.Uic,
            ExpiryDate: instrumentDetails.expiryDate,
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
        accessToken
    );
}

// fetch client details
export function fetchClientInfo(accessToken) {
    return fetchDataQuery(
        'port',
        'v1/clients/me',
        null,
        accessToken
    );
}

// fetch chart data
export function getChartData(accessToken, chartData) {
    const { AssetType, Uic, Horizon, Count } = chartData;

    return fetchDataQuery(
        'chart',
        'v1/charts',
        {
            AssetType,
            Uic,
            Horizon,
            Count,
            FieldGroups: [
                'ChartInfo',
                'Data',
                'DisplayAndFormat',
            ],
        },
        accessToken
    );
}

// fetch option chain based on AssetType
// eg: Query Params : { OptionRootId: 19 }
export function getOptionChain(accessToken, Identifier) {
    return fetchDataQuery(
        'ref',
        `v1/instruments/contractoptionspaces/${Identifier}`,
        null,
        accessToken
    );
}

// fetch Info Prices for a set of instruments based on AssetType and Uics
// eg: Query Params : { AssetType: 'FxSpot', Uics: 21,2 }
export function getInfoPricesList(accessToken, instrumentData) {
    return fetchDataQuery(
        'trade',
        'v1/infoprices/list',
        {
            AssetType: instrumentData.AssetType,
            Uics: instrumentData.Uics,
            FieldGroups: [
                'DisplayAndFormat',
                'InstrumentPriceDetails',
                'MarketDepth',
                'PriceInfo',
                'PriceInfoDetails',
                'Quote',
            ],
        },
        accessToken
    );
}

// return balance information
export function getBalancesInfo(accessToken, params) {
    return fetchDataQuery(
        'port',
        'v1/balances',
        params,
        accessToken
    );
}

export function getFormattedPrice(price, decimal, formatFlags) {
    return formatQuery(price, decimal, formatFlags);
}

/* subscribe to Info prices for a set of instruments based on AssetType and Uics.
    eg: Query Params : {
        Arguments: {
            AssetType: 'FxSpot',
            Uics: 21,2
        },
        RefreshRate: 5
    }
*/
export function subscribeInfoPrices(accessToken, instrumentData, onUpdate, onError) {
    return subscriptionQuery(
        'trade',
        'v1/infoPrices/subscriptions',
        {
            AssetType: instrumentData.AssetType,
            Uics: instrumentData.Uics,
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
        onUpdate,
        onError
    );
}

/*  subscribe to Prices for a single instrument based on AssetType and Uic.
     eg: Query Params : {
         Arguments: {
             AssetType: 'FxSpot',
             Uic: 21
         },
         RefreshRate: 5
     }
*/
export function subscribePrices(accessToken, instrumentData, onUpdate, onError) {
    return subscriptionQuery(
        'trade',
        'v1/Prices/subscriptions',

        {
            ...instrumentData,
            FieldGroups: [
                'Commissions',
                'DisplayAndFormat',
                'Greeks',
                'InstrumentPriceDetails',
                'MarginImpact',
                'MarketDepth',
                'PriceInfo',
                'PriceInfoDetails',
                'Quote',
            ],
        },

        accessToken,
        onUpdate,
        onError
    );
}

/* handling chart streaming data*/

export function subscribeChartStreamingData(accessToken, chartData, onUpdate, onError) {
    return subscriptionQuery(
        'chart',
        'v1/charts/subscriptions',
        {
            AssetType: chartData.AssetType,
            Uic: chartData.Uic,
            Horizon: chartData.Horizon,
            Count: chartData.Count,
        },
        accessToken,
        onUpdate,
        onError
    );

}

// subscribe to Optionschain
export function subscribeOptionsChain(accessToken, optionsData, onUpdate, onError) {
    const { Identifier, AssetType } = optionsData;

    return subscriptionQuery(
        'trade',
        'v1/optionschain/subscriptions',
        {
            AssetType,
            Identifier,
            MaxStrikesPerExpiry: 4,
        },
        accessToken,
        onUpdate,
        onError
    );

}

// remove individual subscription
export function removeIndividualSubscription(accessToken, subscription) {
    return disposeQuery(subscription, accessToken);
}

// create order subscription
export function createOrderSubscription(accessToken, subscriptionArgs, onUpdate, onError) {
    return subscriptionQuery(
        'port',
        'v1/orders/subscriptions',
        {
            AccountKey: subscriptionArgs.accountKey,
            ClientKey: subscriptionArgs.clientKey,
            FieldGroups: subscriptionArgs.fieldGroups,
        },
        accessToken,
        onUpdate,
        onError
    );
}

// create positions subscription
export function createPositionSubscription(accessToken, subscriptionArgs, onUpdate, onError) {
    const { accountKey, clientKey, fieldGroups, NetPositionId } = subscriptionArgs;
    return subscriptionQuery(
        'port',
        'v1/positions/subscriptions',
        {
            AccountKey: accountKey,
            ClientKey: clientKey,
            FieldGroups: fieldGroups,
            NetPositionId,
        },

        accessToken,
        onUpdate,
        onError
    );
}

// create net positions subscription
export function createNetPositionSubscription(accessToken, subscriptionArgs, onUpdate, onError) {
    const { accountKey, clientKey, fieldGroups } = subscriptionArgs;
    return subscriptionQuery(
        'port',
        'v1/netpositions/subscriptions',
        {
            AccountKey: accountKey,
            ClientKey: clientKey,
            FieldGroups: fieldGroups,
        },

        accessToken,
        onUpdate,
        onError
    );
}

// place order
export function placeOrder(accessToken, order) {
    return postQuery(
        'trade',
        'v2/orders',
        null,
        order,
        accessToken
    );
}
