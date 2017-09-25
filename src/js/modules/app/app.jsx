import React from 'react';
import TopBar from '../../components/topBar';
import SideBar from '../../components/sideBar';
import Details from '../../components/details';
import Loader from '../loader';

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
