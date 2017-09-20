import { connect } from 'react-redux';
import Error from '../../components/error';

const mapStateToProps = (store) => ({ showError: store.error.showError });

export default connect(mapStateToProps)(Error);
