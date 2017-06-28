import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { forEach, find } from 'lodash';
import OnboardingUserSignup from './OnboardingUserSignup';
import OnboardingAttachDocuments from './OnboardingAttachDocuments';
import API from './../utils/API';
import Loader from '../utils/Loader';
import RequestParams from '../utils/RequestParams';

class Onboarding extends React.PureComponent {
	constructor (props) {
		super();
    this.onboardingUserRequestParams = RequestParams.onboardingUserRequestParamaters;

    this.attachUserDocumentsParams = RequestParams.attachUserDocumentsParameters;

    this.state = {
      userDetailsSubmitted : false,
      signupId : '',
      showLoader : false
    }
	}

	componentWillMount() {
		
	}

  populateonboardingUserRequestParams(data) {
    this.onboardingUserRequestParams.PersonalInformation.FirstName = data.FirstName;
    this.onboardingUserRequestParams.PersonalInformation.LastName = data.lastName;
    this.onboardingUserRequestParams.PersonalInformation.ContactInformation.PrimaryPhoneNumber.Number = data.primaryPhoneNumber;
    this.onboardingUserRequestParams.PersonalInformation.ContactInformation.SecondaryPhoneNumber.Number = data.secondaryPhoneNumber;
    this.onboardingUserRequestParams.PersonalInformation.ContactInformation.EmailAddress = data.email;
    // TODO : fill request param using a map
  }

  populateAttachDocumentRequestParams(data){
    this.attachUserDocumentsParams.DocumentType = data.documentType;
    this.attachUserDocumentsParams.RenewalDate =  data.renewalDate;
    this.attachUserDocumentsParams.SignUpId = this.state.signupId;
    this.attachUserDocumentsParams.Title = data.title;
  }

	
  submitUserDetailsSuccessCallback(response){
    this.setState({userDetailsSubmitted : true, signUpId : response.SignUpId, showLoader : false});
  }

  errorCallback(){
    this.setState({showLoader : false});
    alert("Error in submitting form");

    this.clearForm();
  }

  submitUserDetailsHandler(data){
		console.log("In handler")
		console.log(data);
    this.setState({showLoader : true});

    /*this.populateonboardingUserRequestParams(data);*/
    API.signupUser(this.onboardingUserRequestParams, this.submitUserDetailsSuccessCallback.bind(this), this.errorCallback.bind(this));
    this.setState({userDetailsSubmitted : true})

	}

  

  attachUserDocumentSuccessCallback(data){
    this.setState({showLoader : false});
    alert("Successfully attched data");
    this.forceUpdate();
  }

  attachAndFinalizeUserDocumentsSuccessCallback(data){
    this.setState({showLoader : false});
    alert("successfully uploaded all tha data.");

    //TODO : return to home page
  }

  attachDocumentsSubmitHandler(data,finalize) {
      this.setState({showLoader : true});
      this.populateAttachDocumentRequestParams(data);
      var successCallback = finalize ? this.attachUserDocumentSuccessCallback.bind(this) : this.attachAndFinalizeUserDocumentsSuccessCallback.bind(this);     
      API.attachUserDocuments(this.attachUserDocumentsParams, data.document, successCallback, this.errorCallback.bind(this));
  }

  clearForm(){
    document.getElementById("resetId").click();
  }



  renderOnboardingForm(){
    if(this.state.userDetailsSubmitted){
      return <OnboardingAttachDocuments attachDocumentsSubmitHandler={this.attachDocumentsSubmitHandler.bind(this)}/>
    }else{
      return <OnboardingUserSignup submitUserDetailsHandler = {this.submitUserDetailsHandler.bind(this)}/>
    }
  }

  getLoader(){
    if(this.state.showLoader){
      return <Loader/>
    }
  }

	render() {
		return (
			<div className='pad-box'>
        {this.getLoader()}
				{this.renderOnboardingForm()}
			</div>
		);
	}
}
export default bindHandlers(Onboarding);