import { connect } from 'react-redux';
import * as errorActions from '../error/actions';
import * as loaderActions from '../loader/actions';
import InstrumentDetails from './instrumentDetails';

const mapStateToProps = (store) => ({
    accessToken: store.userInfo.accessToken,    
});

const matDispatchToProps = (dispatch) => ({
    hideError: () => dispatch(errorActions.hideError()),    
    showError: () => dispatch(errorActions.showError()),    
    hideLoader: () => dispatch(loaderActions.hideLoader()),    
    showLoader: () => dispatch(loaderActions.showLoader()),    
});

export default connect(mapStateToProps, matDispatchToProps)(InstrumentDetails);
