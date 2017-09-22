import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

function Dropdown({ data, title, id, itemKey, value, handleSelect }) {
    return (
        <DropdownButton bsStyle='primary' id={id} title={title} onSelect={handleSelect}>
            {_.map(data, (item) => <MenuItem
                    eventKey={item}
                    key={itemKey ? item[itemKey] : item}
                >
                    {value ? item[value] : item}
                </MenuItem>
            )}
        </DropdownButton>
    );
}

export default Dropdown;
