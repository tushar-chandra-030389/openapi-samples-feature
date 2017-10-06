import * as actionTypes from './actionTypes';
import _ from 'lodash';

const initialState = { showError: false };

function showError(state) {
    return _.defaults({ showError: true }, state);
}

function hideError(state) {
    return _.defaults({ showError: false }, state);
}

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SHOW_ERROR:
            return showError(state);

        case actionTypes.HIDE_ERROR:
            return hideError(state);

        default:
            return state;
    }
}
