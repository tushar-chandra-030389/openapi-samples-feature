import { connect } from 'react-redux';
import Error from './error';
import * as errorActions from './actions';

const mapStateToProps = (store) => {
    return {
        showError: store.error.showError,
        errMessage: store.error.errMessage,
    };
};

const matDispatchToProps = (dispatch) => {
    return { hideError: () => dispatch(errorActions.hideError()) };
};

export default connect(mapStateToProps, matDispatchToProps)(Error);
