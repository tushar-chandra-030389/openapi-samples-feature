import { connect } from 'react-redux';
import Error from '../../components/error';
import * as errorActions from './actions';

const mapStateToProps = (store) => ({ showError: store.error.showError });

const matDispatchToProps = (dispatch) => ({
    hideError: () => dispatch(errorActions.hideError())
});

export default connect(mapStateToProps, matDispatchToProps)(Error);
