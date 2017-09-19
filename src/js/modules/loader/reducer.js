import * as actionTypes from './actionTypes';

const initialState = { isLoading: false };

function _showLoader(state) {
    return Object.assign({}, state, { isLoading: true });
}

function _hideLoader(state) {
    return Object.assign({}, state, { isLoading: false });
}

export default function(state = initialState, action) {
    switch (action.type) {        
        case actionTypes.SHOW_LOADER:
            return _showLoader(state);

        case actionTypes.HIDE_LOADER:
            return _hideLoader(state);

        default:
            return state;
    }
} 