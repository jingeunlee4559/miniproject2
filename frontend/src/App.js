import React from 'react';
import { useState } from 'react';
import "./App.css"
import Home from './pages/Home';
import { Routes,Route } from 'react-router-dom';

import Commuinty from './pages/Commuinty';
import Navs from './components/Navs';
import Aistep1 from "./components/Aichosteps/Aistep1";
import Aistep2 from "./components/Aichosteps/Aistep2";
import Aistep3 from "./components/Aichosteps/Aistep3";
import Aistep4 from "./components/Aichosteps/Aistep4";
import Aicho from "./pages/Aicho";
import { createContext } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Infomy from "./components/Mypage/Infomy";
import WritePost from "./pages/WritePost";
import Schedule from "./components/Mypage/Schedule";
import Mypage from "./pages/Mypage";
import Board from './pages/Board';
import Boards from './pages/Boards';
import DetailPage from './pages/DetaPage';
import Category from './pages/Category';


export  const Appdata = createContext();

function App() {

    const [data,setData] = useState({nick :'냉면'});

  return (
    <div className='App'>
      <Appdata.Provider value={{shareData : data,setShare : setData}}>
      <Navs/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/Login" element={<Login />} />
        <Route path='/board' element={<Board/>} />
        <Route path="/Register"  element= {<Register/>}/>
        <Route path="/Board" element={<Board />} />
        <Route path="/Board/:board_seq" element={<DetailPage/>}/>
         <Route path="/Boards" element={<Boards />} />
        <Route path='/community' element={<Commuinty/>} />
        <Route path="/WritePost"  element= {<WritePost/>}/>
        <Route path="/Category"  element= {<Category/>}/>
        <Route path="/Aichoice" element={<Aicho />}>
            <Route path ="/Aichoice" element={<Aistep1/>}/>
            <Route path="/Aichoice/2" element={<Aistep2 />} />
            <Route path="/Aichoice/2/3" element={<Aistep3 />} />
            <Route path="/Aichoice/2/3/4" element={<Aistep4 />} />
        </Route>
        <Route path="/Mypage"  element= {<Mypage/>}>
           <Route path="/Mypage"  element= {<Infomy/>}/>
           <Route path="/Mypage/schedule"  element= {<Schedule/>}/>
        </Route>
      </Routes>
      </Appdata.Provider>
    </div>
  );
}

export default App;