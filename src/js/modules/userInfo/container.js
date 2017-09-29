import { connect } from 'react-redux';
import UserInfo from './userInfo';
import * as tokenActions from './actions';

const mapStateToProps = (store) => ({
    userData: store.userInfo.userData,
});

const mapDispatchToProps = (dispatch) => ({
    getUserDetails: (accessToken) => dispatch(tokenActions.getUser(accessToken)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);