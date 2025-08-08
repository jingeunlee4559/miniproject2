import React from 'react';
import { useState } from 'react';
import "./App.css"
import Navs from './components/Navs';

import { createContext } from 'react';

import Approutes from './routes/Approutes';


export  const Appdata = createContext();

function App() {

    const [data,setData] = useState({nick :'냉면'});
    // 커밋
  return (
    <div className='App'>
      <Appdata.Provider value={{shareData : data,setShare : setData}}>
      <Navs/>
      <Approutes/>
      </Appdata.Provider>
    </div>
  );
}

export default App;