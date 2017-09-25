import saxo from 'openapi-clientlib';

const transportUrl = 'https://gateway.saxobank.com/sim/openapi';
const streamingUrl = 'https://streaming.saxotrader.com/sim/openapi';

let transport;
let streaming;
let prevTokenState = '';
let priceFormatter = new saxo.PriceFormatting();

export function getTransportAuth(authToken = 'default_token') {
    if (transport && prevTokenState === authToken) {
        transport = transport;
    } else {
        transport = new saxo.openapi.TransportAuth(transportUrl, { token: authToken });
        prevTokenState = authToken;
    }
    return transport;
}

export function getStreamingObj(authToken = 'default_token') {
    if (streaming && prevTokenState === authToken) {
        streaming = streaming;
    } else {
        streaming = new saxo.openapi.Streaming(this.transport, streamingUrl, { getToken: () => authToken });
        prevTokenState = authToken;
    }
    return streaming;
}

export function getData(params) {
    return getTransportAuth(params.accessToken).get(params.serviceGroup, params.endPoint, null, {
        queryParams: params.queryParams
    });
}

export function formatPrice(price, decimal, formatFlags) {
    return priceFormatter.format(price, decimal, formatFlags);
}
