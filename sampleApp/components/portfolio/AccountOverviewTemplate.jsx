import React from 'react';
import {Modal, Row, Col} from 'react-bootstrap';

export default (props) => {
	console.log(props.overviewData);
	return (
		<div className="static-modal">
		    <div>
		      <div className="account-modal account-modal-head">
		        <div className="modal-title-custom">Account Details</div>
		        <div>
		        	<Row className="modal-title-row">
		        		<Col xs={8} md={8}>All Accounts</Col>
		        		<Col xs={4} md={4}>{props.overviewData.Currency}</Col>
		        	</Row>
		        </div>
		      </div>
		      		
		      <div className="account-modal account-modal-body">
		        <Row >
		      		<Col className="row-head" xs={12} md={12}>Cash and positions</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Cash balance</Col>
		        	<Col xs={4} md={4}>{props.overviewData.CashBalance}</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Transactions not booked</Col>
		        	<Col xs={4} md={4}>{props.overviewData.TransactionsNotBooked}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={12} md={12}>Cash available</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Value of stocks, ETFs, bounds</Col>
		        	<Col xs={4} md={4}>{props.overviewData.NonMarginPositionsValue}</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>P/L of margin positions</Col>
		        	<Col xs={4} md={4}>{props.overviewData.UnrealizedMarginProfitLoss}</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Cost to close</Col>
		        	<Col xs={4} md={4}>{props.overviewData.CostToClosePositions}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={8} md={8}>Value of positions</Col>
		      		<Col className="row-head" xs={4} md={4}>{props.overviewData.NonMarginPositionsValue + props.overviewData.UnrealizedMarginProfitLoss + props.overviewData.CostToClosePositions + (props.overviewData.OptionPremiumsMarketValue || 0)}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={8} md={8}>Account value</Col>
		      		<Col className="row-head" xs={4} md={4}>{props.overviewData.TotalValue}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={12} md={12}>Margin</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Not available as margin collateral</Col>
		        	<Col xs={4} md={4}>{props.overviewData.MarginCollateralNotAvailable}</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Reserved for margin positions</Col>
		        	<Col xs={4} md={4}>{props.overviewData.MarginUsedByCurrentPositions}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={8} md={8}>Margin available</Col>
		      		<Col className="row-head" xs={4} md={4}>{props.overviewData.MarginAvailableForTrading}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={8} md={8}>Margin utilisation</Col>
		      		<Col className="row-head" xs={4} md={4}>{props.overviewData.MarginUtilizationPct}</Col>
		      	</Row>
		      	<div className="horizontal-line"></div>
		      	<Row >
		      		<Col className="row-head" xs={12} md={12}>Exposure</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Net exposure</Col>
		        	<Col xs={4} md={4}>{props.overviewData.MarginNetExposure || 0}</Col>
		      	</Row>
		      	<Row className="row-body">
		      		<Col xs={8} md={8}>Exposure coverage</Col>
		        	<Col xs={4} md={4}>{props.overviewData.MarginExposureCoveragePct || 0}</Col>
		      	</Row>
		      </div>

		    </div>
  		</div>
	);
};