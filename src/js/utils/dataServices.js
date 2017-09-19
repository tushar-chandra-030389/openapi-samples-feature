import saxo from 'openapi-clientlib';

const transportUrl = 'https://gateway.saxobank.com/sim/openapi';
const streamingUrl = 'https://streaming.saxotrader.com/sim/openapi';

let transport;
let streaming;

export function getTransportAuth(authToken = 'default_token') {
    if (transport) {
        transport = transport;
    } else {
        transport = new saxo.openapi.TransportAuth(transportUrl, { token: authToken });
    }
    return transport;
}

export function getStreamingObj(authToken = 'default_token') {
    if (streaming) {
        streaming = streaming;
    } else {
        streaming = new saxo.openapi.Streaming(this.transport, streamingUrl, { getToken: () => authToken });
    }
    return streaming;
}

export function getData(params) {
    return getTransportAuth(params.accessToken).get(params.serviceGroup, params.endPoint, null);
}