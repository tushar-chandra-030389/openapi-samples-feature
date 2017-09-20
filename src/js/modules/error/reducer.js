import * as actionTypes from './actionTypes';

const initialState = { showError: false };

function _showError(state) {
    return Object.assign({}, state, { showError: true });
}

function _hideError(state) {
    return Object.assign({}, state, { showError: false });
}

export default function(state = initialState, action) {
    switch (action.type) {        
        case actionTypes.SHOW_ERROR:
            return _showError(state);

        case actionTypes.HIDE_ERROR:
            return _hideError(state);

        default:
            return state;
    }
} 