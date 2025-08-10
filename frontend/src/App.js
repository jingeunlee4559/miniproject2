import React from 'react';
import { useState } from 'react';
import './App.css';
import { createContext } from 'react';

import Approutes from './routes/Approutes';
import ScrollToTop from './components/common/ScrollToTop';

export const Appdata = createContext();

function App() {
    const [data, setData] = useState({ nick: '냉면' });
    // 커밋
    return (
        <div className="App">
            <Appdata.Provider value={{ shareData: data, setShare: setData }}>
                <ScrollToTop />
                <Approutes />
            </Appdata.Provider>
        </div>
    );
}

export default App;
