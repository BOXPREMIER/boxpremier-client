// import Logo from "../assets/Logo.png"; 
// import logo2 from "../assets/logo2.png";
// import { useState, useEffect } from "react"; 
// import { NavLink, useLocation, useNavigate, Link } from "react-router-dom"; 
// import useAuthStore from "../store/authStore";

// const NavBar = ({ logo = Logo }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation(); //borrar si no lo vamos a usar
//   const navigate = useNavigate();//borrar si no lo  vamos a usar

//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const user = useAuthStore((state) => state.user);
//   const logout = useAuthStore((state) => state.logout);

 
//   return (
//     <nav className="w-full bg-black text-white px-6 py-3">
//      <div className="flex items-center justify-between">
//         <Link to="/" aria-label="Ir al inicio">
//           <img
//             src={logo}
//             alt="Vino Premier"
//             className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
//           />
//         </Link>

//         {/* Logo central (solo visible en pantallas medianas y grandes) */}
//         <div className="hidden md:flex justify-center items-center">
//           <Link to="/subscriptionPage" aria-label="Página de suscripción">
//             <img
//               src={logo2}
//               alt="Círculo dorado - Suscripción"
//               className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
//             />
//           </Link>
//         </div>

//         {/* Menú hamburguesa (solo visible en móviles) */}
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="block md:hidden p-2 text-2xl"
//           aria-label="Abrir o cerrar menú"
//         >
//           {isMenuOpen ? "Χ" : "☰"}
//         </button>

//         {/* Enlaces de escritorio */}
//         <div className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
//           <NavLink
//             to="/login"
//             className={({ isActive }) =>
//               `hover:text-[#C9A35C] transition-colors ${
//                 isActive ? "text-[#C9A35C]" : ""
//               }`
//             }
//           >
//             LOGIN
//           </NavLink>

//           <button
//             type="button"
//             aria-label="Cambiar idioma"
//             className="flex items-center gap-1 hover:text-[#C9A35C] transition-colors"
//           >
//             <span>IDIOMA</span>
//           </button>
//         </div>
//       </div>

//       {/* Menú móvil desplegable */}
//       {isMenuOpen && (
//         <div className="md:hidden flex flex-col items-start gap-3 mt-4 text-sm font-semibold tracking-wide">
//           {/* Logo dorado en versión móvil */}
//           <Link
//             to="/subscriptionPage"
//             className="hover:text-[#C9A35C] transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             SUSCRIPCIÓN
//           </Link>

//           <NavLink
//             to="/login"
//             className={({ isActive }) =>
//               `hover:text-[#C9A35C] transition-colors ${
//                 isActive ? "text-[#C9A35C]" : ""
//               }`
//             }
//             onClick={() => setIsMenuOpen(false)}
//           >
//             LOGIN
//           </NavLink>

//           <button
//             type="button"
//             aria-label="Cambiar idioma"
//             className="hover:text-[#C9A35C] transition-colors"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             IDIOMA
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default NavBar;

import Logo from "../assets/full-logo-white.png";
import logo2 from "../assets/logo2.png";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const NavBar = ({ logo = Logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="w-full bg-black text-white px-6 py-3">
     <div className="flex items-center justify-between">
        {/* Ir a la Home dentro de la app */}
        <Link to="/app" aria-label="Ir al inicio" data-testid="link-home">
          <img
            src={logo}
            alt="Vino Premier"
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="hidden md:flex justify-center items-center">
          <NavLink
            to="subscription"
            aria-label="Página de suscripción"
            data-testid="link-subscription"
          >
            <img
              src={logo2}
              alt="Círculo dorado - Suscripción"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </NavLink>
        </div>

        {/* Menú hamburguesa (móvil) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block md:hidden p-2 text-2xl"
          aria-label="Abrir o cerrar menú"
          data-testid="mobile-menu-button"
        >
          {isMenuOpen ? "Χ" : "☰"}
        </button>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `hover:text-[#C9A35C] transition-colors ${
                isActive ? "text-[#C9A35C]" : ""
              }`
            }
          >
            LOGIN
          </NavLink>

        </div>
      </div>

      {isMenuOpen && (
        <div
          className="md:hidden flex flex-col items-start gap-3 mt-4 text-sm font-semibold tracking-wide"
          data-testid="mobile-menu"
        >
          <NavLink
            to="/subscriptionPage"
            className="hover:text-[#C9A35C] transition-colors"
            onClick={() => setIsMenuOpen(false)}
            data-testid="mobile-link-subscription"
          >
            SUSCRIPCIÓN
          </NavLink>

          {/* Auth absoluto */}
          {isAuthenticated && user ? (
            <>
              <span data-testid="mobile-username">{user.name}</span>
              <button onClick={logout} data-testid="mobile-logout-button">LOGOUT</button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-link-login"
              >
                LOGIN
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
