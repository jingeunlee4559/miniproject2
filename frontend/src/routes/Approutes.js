import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Board from '../pages/Board';
import Register from '../pages/Register';
import DetailPage from '../pages/DetaPage';
import Boards from '../pages/Boards';
import Commuinty from '../pages/Commuinty';
import WritePost from '../pages/WritePost';
import Category from '../pages/Category';
import Aicho from '../pages/Aicho';

import Aistep1 from '../components/Aichosteps/Aistep1';
import Aistep2 from '../components/Aichosteps/Aistep2';
import Aistep3 from '../components/Aichosteps/Aistep3';
import Aistep4 from '../components/Aichosteps/Aistep4';

import Mypage from '../pages/Mypage';
import Infomy from '../components/Mypage/Infomy';
import Schedule from '../components/Mypage/Schedule';
import MainLayout from '../layouts/MainLayout.js';
import Categorydetail from '../pages/Categorydetail.js';

function Approutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/board" element={<Board />} />
                <Route path="/boards" element={<Boards />} />
                <Route path="/community" element={<Commuinty />} />
                <Route path="/writepost" element={<WritePost />} />
                <Route path="/category" element={<Category />} />
                <Route path="/board/:board_seq" element={<DetailPage />} />
                <Route path="/Category/:store_idx" element={<Categorydetail />} />
            </Route>

            <Route element={<MainLayout />}>
                <Route path="/aichoice" element={<Aicho />}>
                    <Route index element={<Aistep1 />} />
                    <Route path="2" element={<Aistep2 />} />
                    <Route path="2/3" element={<Aistep3 />} />
                    <Route path="2/3/4" element={<Aistep4 />} />
                </Route>
                <Route path="/mypage" element={<Mypage />}>
                    <Route index element={<Infomy />} />
                    <Route path="schedule" element={<Schedule />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default Approutes;
