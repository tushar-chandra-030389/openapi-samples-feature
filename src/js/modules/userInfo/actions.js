import * as actionTypes from './actionTypes';
import * as loaderActions from '../loader/actions';
import { getUserDetails } from '../../utils/api';

export function updateUserInfo(accessToken, userData) {
    return { type: actionTypes.UPDATE_USER_INFO, accessToken, userData };
}

export function getUser(accessToken) {
    return (dispatch, getStore) => {
        dispatch(loaderActions.showLoader());
        getUserDetails(accessToken)
        .then((result) => {
            dispatch(updateUserInfo(accessToken, result.response))
        })
        .catch((err) => console.log('E : ', err))
        .then(() => dispatch(loaderActions.hideLoader()));
    }
}
