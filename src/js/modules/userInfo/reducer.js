import * as actionTypes from './actionTypes';

const initialState = {
    accessToken: undefined,
    userData: {}
};

function _updateUserInfo(state, { accessToken, userData }) {
    return Object.assign({}, state, { accessToken, userData });
}

export default function(state = initialState, action) {
    switch (action.type) {
        case actionTypes.UPDATE_USER_INFO:
            return _updateUserInfo(state, action);

        default:
            return state;
    }
}
