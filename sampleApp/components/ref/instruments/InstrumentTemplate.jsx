import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem, InputGroup} from 'react-bootstrap';
import SearchInput, { createFilter } from 'react-search-input';
import { filter } from 'lodash';
import CustomTable from '../../utils/CustomTable';

const KEYS_TO_FILTERS = ['Description', 'Symbol'];

export default (props) => {
    let instruments = props.instrumentList.map((instrument) =>  <MenuItem eventKey = {instrument} key = {instrument.Symbol}> {instrument.Description} </MenuItem> );
    let assetTypes = props.assetTypes.map((assetType) => <MenuItem eventKey = {assetType} key = {assetType}> {assetType} </MenuItem> );
	let data = !props.parent ? filter(props.instrumentList, createFilter(props.state.searchTerm, KEYS_TO_FILTERS)) : null;
	return (
	    <div className='padBox'>
		    <ButtonToolbar>
		        <DropdownButton bsStyle='primary' title={props.state.assetType} id='dropdown-size-large' onSelect = {props.handleAssetTypeSelected} >
		        	{assetTypes}
		        </DropdownButton>
		        { props.state.hasInstruments ?
		        	props.parent ?
			        (<DropdownButton bsStyle='primary' title={props.state.instrument} id='dropdown-size-large' onSelect = {props.handleInstrumentSelected}>
						{instruments}
			        </DropdownButton>) :
			        (<div>
			        	<br/><br/><br/>
				      	<InputGroup>
				        	<InputGroup.Addon><img src='../images/search-icon.png' className='search-icon'></img></InputGroup.Addon>
				        	<SearchInput className='search-input' onChange={props.searchUpdated}/>
				      	</InputGroup>
			        	<br/><br/><br/>
						<CustomTable data={data} keyField='Identifier' dataSortFields={['Identifier', 'Symbol']} width='150'/>
					</div>)
				: null }
		    </ButtonToolbar>
		</div>
	);
};



