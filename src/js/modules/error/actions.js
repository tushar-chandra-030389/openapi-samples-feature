import * as actionTypes from './actionTypes';

export function showError() {
    return { type: actionTypes.SHOW_ERROR };
}

export function hideError() {
    return { type: actionTypes.HIDE_ERROR };
}

export function setErrorMessage(msg) {
    return { type: actionTypes.ERR_MESSAGE, message: msg };
}
