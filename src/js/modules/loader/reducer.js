import * as actionTypes from './actionTypes';
import _ from 'lodash';

const initialState = { isLoading: false };

function showLoader(state) {
    return _.defaults({ isLoading: true }, state);
}

function hideLoader(state) {
    return _.defaults({ isLoading: false }, state);
}

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SHOW_LOADER:
            return showLoader(state);

        case actionTypes.HIDE_LOADER:
            return hideLoader(state);

        default:
            return state;
    }
}
