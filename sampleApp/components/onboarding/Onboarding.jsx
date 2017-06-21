import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { forEach, find } from 'lodash';
import OnboardingTemplate from './OnboardingTemplate';
import OnboardingUserTemplate from './OnboardingUserTemplate';
import API from './../utils/API';
import Loader from '../utils/Loader';
class Onboarding extends React.PureComponent {
	constructor (props) {
		super();
    this.signupRequestParams = {
			AccountInformation : {
				CurrencyCode: "test",
  				IntendedCommissionGroupId: "test",
  				IntendedTemplateId: "test",
  				OtherInstructions: "test"
			},
			PersonalInformation : {
				CityOfBirth: "test",
  				ContactInformation: {
    				EmailAddress: "test",
    				PrimaryPhoneNumber: {
      					CountryCode: "test",
      					Number: "test"
    				},
    				SecondaryPhoneNumber: {
      					CountryCode: "test",
      					Number: "test"
    				}	
  				},
  				EmploymentInformation: {
    				EmployerName: "test",
    				OccupationTypes: [
      					"test"
    				],
    				Position: "test"
  				},
  				FirstName: "test",
  				LastName: "test",
  				ResidentialAddress: {
    				BuildingName: "test",
    				BuildingNumber: "test",
    				City: "test",
    				CountryOfResidenceCode: "test",
    				PostalCode: "test",
    				State: "test",
    				StreetName: "test"
  				},
  				ServiceLanguageCode: "test"
			},
			ProfileInformation : {
				AnnualIncomeInformation: {
    				AnnualSalaryAfterTax: "test",
    				SecondarySourcesOfIncome: [
      					"test"
    				],
   		 			SecondarySourcesOfIncomeTotal: "test"
  				},
  				InvestableAssets: {
    				IntendToInvest: "test",
    				PrimarySourcesOfWealth: [
      					"test"
    				],
    				ValueOfCashAndSecurities: "test"
 				 }	
			},
			RegulatoryInformation : {
				FatcaDeclaration: {
    				UnitedStatesCitizen: true,
    				UnitedStatesTaxId: "test",
    				UnitedStatesTaxLiable: false
  				}
			}
		};

    this.attachUserDocumentsParams = {
        DocumentType : 'test',
        RenewalDate : '',
        SignUpId : '',
        Title : ''
    }

    this.state = {
      userDetailsSubmitted : false,
      signupId : '',
      showLoader : false
    }
	}

	componentWillMount() {
		
	}

  populateSignUpRequestParams(data) {
    this.signupRequestParams.PersonalInformation.FirstName = data.FirstName;
    this.signupRequestParams.PersonalInformation.LastName = data.lastName;
    this.signupRequestParams.PersonalInformation.ContactInformation.PrimaryPhoneNumber.Number = data.primaryPhoneNumber;
    this.signupRequestParams.PersonalInformation.ContactInformation.SecondaryPhoneNumber.Number = data.secondaryPhoneNumber;
    this.signupRequestParams.PersonalInformation.ContactInformation.EmailAddress = data.email;

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
  }

  submitUserDetailsHandler(data){
		console.log("In handler")
		console.log(data);
    this.setState({showLoader : true});
    /*this.populateSignUpRequestParams(data);*/
    API.signupUser(this.signupRequestParams, this.submitUserDetailsSuccessCallback.bind(this), this.errorCallback.bind(this));
    this.setState({userDetailsSubmitted : true})

	}

  

  attachUserDocumentSuccessCallback(data){
    this.setState({showLoader : false});
    alert("Successfully attched data");
  }

  attachAndFinalizeUserDocumentsSuccessCallback(data){
    this.setState({showLoader : false});
    alert("successfully uploaded all tha data.");
  }

  submitUserDetailsDocumentsHandler(data) {
      console.log("In attach document handler");
      console.log(data);
      this.setState({showLoader : true});
      this.populateAttachDocumentRequestParams(data);
      API.attachUserDocuments(this.attachUserDocumentsParams, data.document,this.attachUserDocumentSuccessCallback.bind(this), this.errorCallback.bind(this));
  }

  submitAndFinalizeUserDetailsDocumentsHandler(data) {
    this.populateAttachDocumentRequestParams(data);
    API.attachUserDocuments(this.attachUserDocumentsParams, data.document, this.attachAndFinalizeUserDocumentsSuccessCallback.bind(this), this.errorCallback.bind(this));
  }

  

  renderOnboardingForm(){
    if(this.state.userDetailsSubmitted){
      return <OnboardingUserTemplate submitUserDetailsDocuments={this.submitUserDetailsDocumentsHandler.bind(this)} submitAndFinalizeUserDetailsDocumentsHandler = {this.submitAndFinalizeUserDetailsDocumentsHandler.bind(this)}/>
    }else{
      return <OnboardingTemplate submitUserDetailsHandler = {this.submitUserDetailsHandler.bind(this)}/>
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