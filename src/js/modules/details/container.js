import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as errorActions from 'src/js/modules/error/actions';
import * as loaderActions from 'src/js/modules/loader/actions';
import Details from './details';

// this module handles detail page which has child routing for other modules
// like introduction, ref, portfolio and other, so store is attached here and
// passed down as props to other modules
const mapStateToProps = (store) => {
    return {
        accessToken: store.userInfo.accessToken,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        hideError: () => dispatch(errorActions.hideError()),
        showError: () => dispatch(errorActions.showError()),
        hideLoader: () => dispatch(loaderActions.hideLoader()),
        showLoader: () => dispatch(loaderActions.showLoader()),
        setErrMessage: (msg) => dispatch(errorActions.setErrorMessage(msg)),
    };
};

// using withRouter to fix the issue of react-router-dom v4 not working with the redux container
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Details));
