import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const navLinkClass =
    "text-gray-700 hover:text-blue-600 py-2 px-3 border-l-4 border-transparent hover:border-blue-600 transition";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 p-6 hidden md:flex flex-col justify-between min-h-screen border border-blue-100 shadow-lg">
        <div>
        <div className='flex between items-center justify-center mr-4 pb-2'>
          <img  className='h-10' src="/public/logo/diu-Logo.png" alt="" />
          <img className='h-10' src="/public/logo/cselogo.jpg" alt="" />
        </div>
          <div className="text-2xl font-bold text-[#5fadff] text-center">DIU CSE ALUMNI </div>
          <hr />
          <nav className="flex flex-col space-y-4 mt-4">
            <Link to="/" className={navLinkClass}>🏠 Home</Link>
            <Link to="/news" className={navLinkClass}>News</Link>
            <Link to="/event" className={navLinkClass}>Event</Link>
            {/* <Link to="/" className={navLinkClass}>🏠 Admin</Link> */}
          </nav>
          
        </div>
        <div className="mb-4">
          <Link to="/signin" className={navLinkClass}>🔐 Signin</Link>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-opacity-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 w-52 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between py-5 px-2 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-600">DIU CSE ALUMNI</h2>
            <button onClick={closeSidebar} className="text-2xl text-gray-600 hover:text-red-600 focus:outline-none">
              <FiX />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-6">
            <Link to="/" onClick={closeSidebar} className={navLinkClass}>🏠 Home</Link>
            {/* <Link to="/" className={navLinkClass}>🏠 Admin</Link> */}
          </nav>
        </div>
        <div className="p-6">
          <Link to="/signin" onClick={closeSidebar} className={navLinkClass}>🔐 Sign</Link>
        </div>
      </div>

     {/* Mobile Menu Button */}
     {!isSidebarOpen && (
     <div className="fixed top-0 left-0 w-full px-2 py-3 shadow-xl bg-white md:hidden z-50 flex justify-between items-center">
      <button
       onClick={toggleSidebar}
       className="p-2 bg-blue-600 text-white text-xl rounded-xl shadow hover:bg-blue-700 transition flex justify-center items-center"
    >
        <FiMenu className="m-auto" />
      </button>

    {/* Right: DIU Text */}
    <div className="text-blue-600 font-semibold text-lg pr-4">
      <img className='h-10 w-10' src="/public/logo/cselogo.jpg" alt="" />
    </div>
  </div>
)}

    </>
  );
};

export default Navbar;
