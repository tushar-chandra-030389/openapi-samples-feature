import React from 'react';
import { ButtonToolbar, Button, Table} from 'react-bootstrap';
import CustomTable from '../../utils/CustomTable';

export default (props) => {
	return (
		<div className="padBox">
			{props.state.instrumentSelected ? (
				<ButtonToolbar>
					<Button bsStyle="primary" onClick={props.subscribeInstruments}>{props.state.instrumentsSubscribed ? 'Unsubscribe': 'Subscribe'}</Button>
		 			<Button bsStyle="primary" onClick={props.fetchInstrumentsData} disabled={props.state.instrumentsSubscribed}>Get Prices</Button>
		 		</ButtonToolbar>
		    ): null }
		    <br/>
		    <br/>
		    { props.state.instrumentSelected ? (
		    	<CustomTable data={props.getInstrumentData} keyField='Uic' dataSortFields={['Uic', 'AssetType']} width='150'/>
		    ) : null }
		</div>
	)
};
