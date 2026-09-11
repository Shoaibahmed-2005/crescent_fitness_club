import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Particles from './Particles';
import SmoothScroll from './SmoothScroll';

const Layout: React.FC = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col relative">
        <Particles />
        <Navbar />
        
        <main className="flex-grow relative z-10 pt-24">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Layout;
