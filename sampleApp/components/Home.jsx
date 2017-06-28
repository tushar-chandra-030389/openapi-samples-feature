import React from 'react';
import { FormControl, Panel, Button, Row } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import Details from './Details';
import DataService from './utils/DataService';
import Column from './utils/Column';
import UserTemplate from './users/UserTemplate';
import API from './utils/API';
import Loader from './utils/Loader';

class Home extends React.PureComponent {
  constructor() {
    super();
    this.token = '';
    this.userData = {};
    this.state = {toggleState : false, showLoader : false};
  }

  handleChange(event) {
    this.token = event.target.value;
  }

  handleCreateTransport() {
    DataService.createTransport(`Bearer ${this.token}`);
    DataService.createStreamingObject(`Bearer ${this.token}`);
    this.getLoggedInUserDetails();
  }

  getLoggedInUserDetails(){
    this.setState({showLoader : true});
    API.getLoggedInUserDetails(this.handleUserData, this.handleUserDataErrorCallback);
  }

  handleUserData(response) {
    this.userData = response;
    this.setState({ showLoader : false });
  }

  handleUserDataErrorCallback(respone){
    this.setState({showLoader : false});
    alert("Unable to fetch user data");
  }

  getLoader(){
    if(this.state.showLoader){
      return <Loader/>
    }
  }

  render() {
    return (
      <div>
      {this.getLoader()}
      <div className='pad-box'>
        <h3> Set Access Token </h3>
        <h2>
          <small>Please copy authorization token from
            <a
              href='https://www.developer.saxo/'
              target='_blank'>
              Developer's Portal
            </a>.
          </small>
        </h2>
        <Panel header='Access Token' bsStyle='primary'>
          <FormControl
            componentClass='textarea'
            placeholder='Paste authorization token here'
            onChange={this.handleChange} />
          <br />
          <Button bsStyle='primary' onClick={this.handleCreateTransport}>Submit</Button>
        </Panel>
        <Panel>
          <UserTemplate userData={this.userData}/>
        </Panel>
      </div>
      </div>
    );
  }
}

export default bindHandlers(Home);
