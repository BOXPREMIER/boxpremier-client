import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Logo from "../assets/full-logo-white.png"; // большое лого (слева)
import logo2 from "../assets/logo2.png"; // круглое лого (по центру)

const NavLinks = ({ isMobile = false, closeMenu }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const nombreUsuario =
    user?.nombre ||
    user?.name ||
    user?.username ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "usuario";

  const linkClass = ({ isActive }) =>
    `hover:text-[#C9A35C] transition-colors ${isActive ? "text-[#C9A35C]" : ""
    }`;
  const navigate = useNavigate();
  return (
    <div
      className={`${isMobile
        ? "flex flex-col items-start gap-3 mt-4"
        : "flex items-center gap-6"
        } text-sm font-semibold tracking-wide`}
    >
      {/* 🔸 Enlaces principales */}
      <NavLink
        to="/subscription"
        className={linkClass}
        onClick={isMobile ? closeMenu : undefined}
      >
        PLANES
      </NavLink>

      <NavLink
        to="/gift"
        className={linkClass}
        onClick={isMobile ? closeMenu : undefined}
      >
        REGALA
      </NavLink>

      <NavLink
        to="/cajas-anteriores"
        className={linkClass}
        onClick={isMobile ? closeMenu : undefined}
      >
        CAJAS ANTERIORES
      </NavLink>

      {/* 🔹 Usuario logueado */}
      {isAuthenticated && user ? (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="hover:text-[#C9A35C] transition-colors flex items-center gap-1"
          >
            Hola, {nombreUsuario}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
              {/* Функции обычного пользователя */}
              <NavLink
                to="/app/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (closeMenu) closeMenu();
                }}
              >
                Ver perfil
              </NavLink>

              {/* Дополнительно: кнопки админа */}
              {user?.role === "admin" && (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (closeMenu) closeMenu();
                    }}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/users"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (closeMenu) closeMenu();
                    }}
                  >
                    Gestionar usuarios
                  </NavLink>
                </>
              )}

              {/* Кнопка выхода */}
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                  if (closeMenu) closeMenu();
                  navigate("/");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Terminar la sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <NavLink
          to="/login"
          className={linkClass}
          onClick={isMobile ? closeMenu : undefined}
        >
          LOGIN
        </NavLink>
      )}
    </div>
  );
};

// 🔸 Navbar principal
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white px-6 py-3 relative">
      <div className="flex items-center justify-between relative">
        {/* 🔹 Logotipo grande (izquierda) → Home */}
        <Link to="/" aria-label="Ir al inicio">
          <img
            src={Logo}
            alt="Vino Premier Logo"
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* 🔹 Logotipo circular (centro) → Main Page */}
        <Link
          to="/main"
          aria-label="Ir a la página principal"
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <img
            src={logo2}
            alt="Círculo dorado - Main"
            className="h-10 w-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* 🔹 Botón menú hamburguesа (solo móvil) */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="block md:hidden p-2 text-2xl"
          aria-label="Abrir o cerrar menú"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* 🔹 Enlaces de escritorio */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>
      </div>

      {/* 🔹 Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden">
          <NavLinks isMobile closeMenu={() => setIsMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
