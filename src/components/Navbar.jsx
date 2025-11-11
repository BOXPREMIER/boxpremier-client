// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LogoFull from "../assets/full-logo-white.png";
import LogoCircle from "../assets/logo2.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  const navLinks = [
    { name: "Planes", path: "/planes" },
    { name: "Regala", path: "/regala" },
    { name: "Cajas Anteriores", path: "/cajas-anteriores" },
  ];

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      {/* Логотипы */}
      <div className="flex items-center gap-4">
        <img src={LogoFull} alt="Vino Premier Logo" className="h-10" />
        <img src={LogoCircle} alt="Círculo dorado - main" className="h-10" />
      </div>

      {/* Десктоп меню */}
      <div className="hidden md:flex gap-6" data-testid="desktop-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className="hover:underline"
          >
            {link.name}
          </NavLink>
        ))}
        {isAuthenticated ? (
          <button onClick={logout} className="hover:underline">
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="hover:underline">
            Login
          </NavLink>
        )}
      </div>

      {/* Мобильное меню */}
      <div className="md:hidden">
        <button
          aria-label="Abrir o cerrar menú"
          onClick={toggleMobileMenu}
          className="focus:outline-none"
        >
          {isMobileOpen ? "✖" : "☰"}
        </button>

        {isMobileOpen && (
          <div
            className="absolute top-16 left-0 w-full bg-black flex flex-col items-start p-4 gap-4"
            data-testid="mobile-nav"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className="hover:underline w-full"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileOpen(false);
                }}
                className="hover:underline w-full text-left"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="hover:underline w-full"
                onClick={() => setIsMobileOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
