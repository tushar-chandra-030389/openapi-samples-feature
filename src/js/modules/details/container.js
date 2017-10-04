import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as errorActions from 'src/js/modules/error/actions';
import * as loaderActions from 'src/js/modules/loader/actions';
import Details from './details';

const mapStateToProps = (store) => ({
    accessToken: store.userInfo.accessToken,    
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch(errorActions.hideError()),    
    showError: () => dispatch(errorActions.showError()),    
    hideLoader: () => dispatch(loaderActions.hideLoader()),    
    showLoader: () => dispatch(loaderActions.showLoader()),    
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Details));
