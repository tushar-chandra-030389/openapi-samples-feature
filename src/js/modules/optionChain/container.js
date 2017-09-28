import { connect } from 'react-redux';
import * as errorActions from '../error/actions';
import * as loaderActions from '../loader/actions';
import OptionChain from './optionChain';

const mapStateToProps = (store) => {
    return {
        accessToken: store.userInfo.accessToken,
    };
};

const matDispatchToProps = (dispatch) => {
    return {
        hideError: () => dispatch(errorActions.hideError()),
        showError: () => dispatch(errorActions.showError()),
        hideLoader: () => dispatch(loaderActions.hideLoader()),
        showLoader: () => dispatch(loaderActions.showLoader()),
    };
};

export default connect(mapStateToProps, matDispatchToProps)(OptionChain);
