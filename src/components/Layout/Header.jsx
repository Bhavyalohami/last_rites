// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';

// const Header = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const navLinkClasses = ({ isActive }) =>
//     `px-3 py-2 rounded-md transition-all duration-200 ${
//       isActive
//         ? 'text-primary font-semibold underline underline-offset-8 decoration-2'
//         : 'text-gray-700 hover:text-primary hover:underline underline-offset-4'
//     }`;

//   const authLinkClasses = ({ isActive }) =>
//     `px-4 py-2 rounded-md transition ${
//       isActive
//         ? 'text-primary font-semibold underline underline-offset-8 decoration-2'
//         : 'text-gray-700 hover:text-primary hover:underline underline-offset-4'
//     }`;

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//       <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Logo */}
//         <NavLink to="/" className="text-2xl font-serif text-primary hover:text-opacity-80 transition">
//           <img src="/logo.png"  className='h-16 w-16 ' alt="" />
//         </NavLink>

//         {/* Main Navigation */}
//         <ul className="flex space-x-2">
//           <li><NavLink to="/" className={navLinkClasses}>Home</NavLink></li>
//           <li><NavLink to="/about" className={navLinkClasses}>About</NavLink></li>
//           <li><NavLink to="/services" className={navLinkClasses}>Services</NavLink></li>
//           <li><NavLink to="/obituaries" className={navLinkClasses}>Obituaries</NavLink></li>
//           <li><NavLink to="/contact" className={navLinkClasses}>Contact</NavLink></li>
//         </ul>

//         {/* Auth Section */}
//         <div className="flex items-center space-x-3">
//           {isAuthenticated ? (
//             <>
//               <span className="text-gray-600">
//                 Hello,{' '}
//                 <NavLink
//                   to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
//                   className={({ isActive }) =>
//                     `font-semibold transition ${
//                       isActive
//                         ? 'text-primary underline underline-offset-4'
//                         : 'text-primary hover:underline underline-offset-4'
//                     }`
//                   }
//                 >
//                   {user?.name}
//                 </NavLink>
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <NavLink to="/login" className={authLinkClasses}>Login</NavLink>
//               <NavLink to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
//                 Register
//               </NavLink>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import assetUrl from '../../utils/assetUrl';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-stone-900 border-b-2 border-stone-400'
        : 'text-stone-600 hover:text-stone-900'
    }`;

  const authLinkClasses = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-stone-900 border-b-2 border-stone-400'
        : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <header className="bg-[#faf7f2]/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        {/* Logo */}
        <NavLink to="/" className="flex items-center justify-center lg:justify-start">
          <img src={assetUrl('/logo.png')} className="h-14 w-auto" alt="Last Rites" />
        </NavLink>

        {/* Main Navigation */}
        <ul className="flex flex-wrap justify-center gap-1">
          <li><NavLink to="/" className={navLinkClasses}>Home</NavLink></li>
          <li><NavLink to="/about" className={navLinkClasses}>About</NavLink></li>
          <li><NavLink to="/services" className={navLinkClasses}>Services</NavLink></li>
          <li><NavLink to="/obituaries" className={navLinkClasses}>Obituaries</NavLink></li>
          <li><NavLink to="/contact" className={navLinkClasses}>Contact</NavLink></li>
        </ul>

        {/* Auth Section */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-stone-600 text-sm">
                Hello,{' '}
                <NavLink
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                  className={({ isActive }) =>
                    `font-medium transition-colors ${
                      isActive
                        ? 'text-stone-900 border-b-2 border-stone-400'
                        : 'text-stone-700 hover:text-stone-900'
                    }`
                  }
                >
                  {user?.name}
                </NavLink>
              </span>
              <button
                onClick={handleLogout}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={authLinkClasses}>Login</NavLink>
              <NavLink
                to="/register"
                className="bg-stone-700 hover:bg-stone-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
