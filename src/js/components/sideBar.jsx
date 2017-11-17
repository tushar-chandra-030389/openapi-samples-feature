import React from 'react';
import _ from 'lodash';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Accordion from './accordion';
import * as content from '../data/navContent.json';

function SideBar() {
    const navBar = _.map(content.data, (item) => {
        if (item.url) {
            return <Link key={item.heading} to={item.url}><ListGroupItem >{item.heading}</ListGroupItem></Link>;
        } else if (item.body) {
            return <Accordion {...item} key={item.heading}/>;
        }
        return null;

    });

    return (
        <div className="sidebar">
            {navBar}
        </div>
    );
}

export default SideBar;
