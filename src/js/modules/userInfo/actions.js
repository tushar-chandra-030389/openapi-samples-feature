import * as actionTypes from './actionTypes';
import * as loaderActions from 'src/js/modules/loader/actions';
import * as errorActions from 'src/js/modules/error/actions';
import { getUserDetails } from 'src/js/utils/api';

export function updateUserInfo(accessToken, userData) {
    return { type: actionTypes.UPDATE_USER_INFO, accessToken, userData };
}

export function getUser(accessToken) {
    return (dispatch) => {
        dispatch(loaderActions.showLoader());
        dispatch(errorActions.hideError());
        getUserDetails(accessToken)
            .then((result) => dispatch(updateUserInfo(accessToken, result.response)))
            .catch(() => dispatch(errorActions.showError()))
            .then(() => dispatch(loaderActions.hideLoader()));
    };
}
