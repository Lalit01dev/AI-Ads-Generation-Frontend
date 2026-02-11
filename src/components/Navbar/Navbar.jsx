import logo from "../../assets/images/logo.svg";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="bg-[#1E63B6] flex items-center justify-between py-3 px-6 text-white">
      <div className="flex items-center gap-3 logo_wrapper w-[110px]">
        {/* <div className="w-8 h-8 bg-white text-[#1E63B6] rounded-full flex items-center justify-center font-bold">
          R
        </div>
        <span className="font-semibold text-lg">RAVER</span> */}
        <img src={logo} className="img-fluid w-full h-full" alt="Raver AI" />
      </div>
      {/* <div className="flex items-center gap-4">
        <span className="text-sm">Goxemam</span>
        <div className="w-8 h-8 bg-white text-[#1E63B6] rounded-full flex items-center justify-center font-semibold">
          G
        </div>
      </div> */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 rounded-lg transition cursor-pointer"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <FaAngleDown
            size={18}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-200 z-50 ${
            isOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
        >
          <ul className="py-2 text-sm text-black">
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 transition text-base"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100 transition text-base"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
            </li>
            <li className="border-t border-gray-200 my-1"></li>
            <li>
              <Link
                to="/logout"
                className="block px-4 py-2 text-red-500 hover:bg-red-50 transition text-base"
                onClick={() => setIsOpen(false)}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
