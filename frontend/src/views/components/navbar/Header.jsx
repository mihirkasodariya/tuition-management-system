import React, { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileNavbar from './MobileNavbar';
import { getAccessToken } from '@/helpers/local-storage';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navList = [
    { name: 'About', homeRoute: '#about', route: '/#about' },
    { name: 'Services', homeRoute: '#services', route: '/#services' },
    { name: 'How It Works', homeRoute: '#how-it-works', route: '/#how-it-works' },
    { name: 'Testimonials', homeRoute: '#testimonials', route: '/#testimonials' },
    { name: 'Contact', homeRoute: '#contact', route: '/#contact' },
    // { name: 'Syllabus', homeRoute: null, route: '/#boards' },
  ];

  const loginNavigate = useCallback(() => {
    let token = getAccessToken();
    if (token) navigate('/dashboard');
    else navigate('/login');
  }, []);

  const handleClick = (to) => {
    navigate(to);

    // Extract hash
    const hash = to.split('#')[1];
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'instant' });
        }
      }, 500);
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center text-xl font-bold">
          <GraduationCap className="h-6 w-6" />
          <span>AcademIQ Tutorial</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {navList?.map((singleNav) => {
              if (location.pathname === '/') {
                return (
                  <a className="text-sm font-medium hover:text-primary" href={singleNav?.homeRoute}>
                    {singleNav?.name}
                  </a>
                );
              } else {
                return (
                  <a
                    // to={singleNav?.route}
                    className="text-sm font-medium hover:text-primary cursor-pointer"
                    onClick={() => handleClick(singleNav?.route)}
                  >
                    {singleNav?.name}
                  </a>
                );
              }
            })}
            <Link to="/boards" className="text-sm font-medium hover:text-primary">
              Syllabus
            </Link>
            <Button onClick={loginNavigate}>Login</Button>
          </nav>

          {/* Mobile Navigation - Hamburger Menu */}
          <MobileNavbar
            navList={navList}
            loginNavigate={loginNavigate}
            pathname={location.pathname}
            handleClick2={handleClick}
          />
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
