import * as services from './dataServices';

export function fetchDataQuery(serviceGroup, endPoint, queryParams, accessToken) {
    return services.getData({
        serviceGroup,
        endPoint,
        queryParams,
        accessToken,
    });
}

// eslint-disable-next-line max-params
export function subscriptionQuery(serviceGroup, endPoint, Arguments, accessToken, onUpdate, onError) {
    return new Promise((resolve) => {
        const subscription = services.subscribe({
            serviceGroup,
            endPoint,
            queryParams: {
                Arguments,
                RefreshRate: 5,
            },
            accessToken,
        }, onUpdate, onError);
        resolve(subscription);
    });
}

export function postQuery(serviceGroup, endPoint, queryParams, body, accessToken) {
    return services.postData({
        serviceGroup,
        endPoint,
        queryParams,
        body,
        accessToken,
    });
}

export function disposeQuery(subscription, accessToken) {
    return new Promise((resolve) => {
        services.disposeIndividualSubscription(accessToken, subscription);
        resolve();
    });
}

export function formatQuery(price, decimal, formatFlags) {
    return services.formatPrice(price, decimal, formatFlags);
}
