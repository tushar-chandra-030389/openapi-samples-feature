import React from 'react';
import { last } from 'lodash';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import Details from '../../components/Details';
import PageDescMapper from '../../data'

function App({children, routes}) {
  const descObj = PageDescMapper[last(routes).path];
  return (
		<div>
			<TopBar />
			<SideBar />
      <Details
        title={descObj.title}
        description={descObj.desc}>
			  {children}
      </Details>
		</div>
  );
}

export default App;
