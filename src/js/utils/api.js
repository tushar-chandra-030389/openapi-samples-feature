import { getData } from './dataServices';

//fetches user data from openapi/port/v1/users/me
export function getUserDetails(accessToken) {
    return getData({
        serviceGroup: 'port',
        endPoint: 'v1/users/me',
        accessToken,
    });
}
