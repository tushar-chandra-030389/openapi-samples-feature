import React from 'react';
import _ from 'lodash';
import { ListGroupItem } from 'react-bootstrap';
import Accordion from './accordion';
import * as content from '../data/navContent.json';

function SideBar() {
    const navBar = _.map(content.data, (item) => {
        if (item.url) {
            return <ListGroupItem key={item.heading} href={item.url}>{item.heading}</ListGroupItem>;
        } else if (item.body) {
            return <Accordion {...item} key={item.heading}/>;
        }
        return '';

    });

    return (
        <div className="sidebar">
            {navBar}
        </div>
    );
}

export default SideBar;
