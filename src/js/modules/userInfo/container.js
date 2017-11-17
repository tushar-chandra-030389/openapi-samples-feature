import { connect } from 'react-redux';
import UserInfo from './userInfo';
import * as tokenActions from './actions';

const mapStateToProps = (store) => {
    return {
        userData: store.userInfo.userData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUserDetails: (accessToken) => dispatch(tokenActions.getUser(accessToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
