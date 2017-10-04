import React from 'react';
import TopBar from 'src/js/components/topBar';
import SideBar from 'src/js/components/sideBar';
import Details from 'src/js/modules/details';
import Loader from 'src/js/modules/loader';

function App() {
    return (
        <div>
            <TopBar/>
            <SideBar/>
            <Details/>
            <Loader/>
        </div>
    );
}

export default App;
