import { connect } from 'react-redux';
import Loader from './loader';

const mapStateToProps = (store) => {
    return { isLoading: store.loader.isLoading };
};

export default connect(mapStateToProps)(Loader);
