import React from 'react';
import { Outlet } from 'react-router-dom';
import Navs from '../components/Navs';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navs />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
