import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import CustomTable from '../../utils/CustomTable';

export default (props) => {
	const { props : {
		instrumentSelected,
		instrumentsSubscribed
	}, handleFetchInstrumentsData, getInstrumentData, handleSubscribeInstruments } = props;

	return (
		<div className='pad-box'>
			{ instrumentSelected && (
				<ButtonToolbar>
					<Button
					  bsStyle='primary'
					  onClick={handleSubscribeInstruments}>
					  {instrumentsSubscribed ? 'Unsubscribe': 'Subscribe'}
					</Button>
		 			<Button
		 			  bsStyle='primary'
		 			  onClick={handleFetchInstrumentsData}
		 			  disabled={instrumentsSubscribed}>
		 			  Get Prices
		 			</Button>
		 		</ButtonToolbar>
		    )}
		    <br/>
		    <br/>
		    { instrumentSelected && (
		    	<CustomTable
		    	  data={getInstrumentData}
		    	  keyField='Uic'
		    	  dataSortFields={['Uic', 'AssetType']}
		    	  width={'150'}
		    	  hidden={['DisplayAndFormat.Decimals', 'DisplayAndFormat.Format', 'DisplayAndFormat.OrderDecimals']}
		    	  formatter={'DisplayAndFormat.Decimals'}
		    	  priceFields={['Quote.Ask', 'Quote.Bid', 'Quote.Mid', 'PriceInfoDetails.LastClose', 'PriceInfoDetails.LastTraded', 'PriceInfo.High', 'PriceInfo.Low']} />
		    )}
		</div>
	)
};
