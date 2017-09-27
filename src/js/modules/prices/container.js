import { connect } from 'react-redux';
import * as errorActions from '../error/actions';
import * as loaderActions from '../loader/actions';
import Prices from './Prices';

const mapStateToProps = (store) => ({
    accessToken: store.userInfo.accessToken,
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch(errorActions.hideError()),
    showError: () => dispatch(errorActions.showError()),
    hideLoader: () => dispatch(loaderActions.hideLoader()),
    showLoader: () => dispatch(loaderActions.showLoader()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prices);
