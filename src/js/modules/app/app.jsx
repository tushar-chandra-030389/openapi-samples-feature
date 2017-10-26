import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import TopBar from 'src/js/components/topBar';
import SideBar from 'src/js/components/sideBar';
import Details from 'src/js/modules/details';
import Loader from 'src/js/modules/loader';

function App() {
    return (
        <Router>
            <div>
                <TopBar/>
                <SideBar/>
                <Details/>
                <Loader/>
            </div>
        </Router>
    );
}

export default App;
