import saxo from 'openapi-clientlib';
import $ from '../../../sampleApp/libs/jquery-3.1.1';
import signalR from '../../../sampleApp/libs/jquery.signalR-2.2.1';

const transportUrl = 'https://gateway.saxobank.com/sim/openapi';
const streamingUrl = 'https://streaming.saxotrader.com/sim/openapi';

let transport;
let streaming;
let prevTokenState = '';
let priceFormatter = new saxo.PriceFormatting();
let subscriptions = [];

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
        streaming = new saxo.openapi.Streaming(getTransportAuth(authToken), streamingUrl, { getToken: () => authToken });
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

export function subscribe(params, onUpdate, onError) {
    const subscription = getStreamingObj(params.accessToken)
        .createSubscription(params.serviceGroup, params.endPoint, params.queryParams, onUpdate, onError);
    subscriptions.push(subscription);
    return subscription;
}

export function disposeIndividualSubscription(accessToken, subscription) {
    getStreamingObj(accessToken).disposeSubscription(subscription);
}
