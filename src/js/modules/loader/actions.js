import * as actionTypes from './actionTypes';

export function showLoader() {
    return { type: actionTypes.SHOW_LOADER };
}

export function hideLoader() {
    return { type: actionTypes.HIDE_LOADER };
}
