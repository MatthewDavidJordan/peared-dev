'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CodeIcon, HamburgerMenuClose, HamburgerMenuOpen } from './Icons';
import './Navbar.css';

function NavBar() {
  const [click, setClick] = useState(false);
  const pathname = usePathname();

  const handleClick = () => setClick(!click);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span>College Compass</span>
        </Link>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          {/* <li className="nav-item">
            <Link href="/" className={`nav-links ${pathname === "/" ? "active" : ""}`} onClick={handleClick}>
              Home
            </Link>
          </li> */}
          <li className="nav-item">
            <Link
              href="/about"
              className={`nav-links ${pathname === '/about' ? 'active' : ''}`}
              onClick={handleClick}
            >
              About
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link href="/blog" className={`nav-links ${pathname === "/blog" ? "active" : ""}`} onClick={handleClick}>
              Blog
            </Link>
          </li> */}
          <li className="nav-item">
            <Link
              href="/contact"
              className={`nav-links ${pathname === '/contact' ? 'active' : ''}`}
              onClick={handleClick}
            >
              Contact Us
            </Link>
          </li>
        </ul>
        <div className="nav-icon" onClick={handleClick}>
          {click ? (
            <span className="icon">
              <HamburgerMenuClose />
            </span>
          ) : (
            <span className="icon">
              <HamburgerMenuOpen />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
