import * as actionTypes from './actionTypes';
import _ from 'lodash';

const initialState = { showError: false, errMessage: '' };

// this state logic help in showing error alert
function showError(state) {
    return _.defaults({ showError: true }, state);
}

// this state logic help in hiding error alert
function hideError(state) {
    return _.defaults({ showError: false }, state);
}

// this state logic help in showing appropriate error message as alert.
function setErrorMessage(msg) {
    return _.defaults({ showError: true }, { errMessage: msg });
}

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SHOW_ERROR:
            return showError(state);

        case actionTypes.HIDE_ERROR:
            return hideError(state);

        case actionTypes.ERR_MESSAGE:
            return setErrorMessage(action.message);

        default:
            return state;
    }
}
