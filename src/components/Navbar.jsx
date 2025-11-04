import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Logo from "../assets/full-logo-white.png"; // большое лого (слева)
import logo2 from "../assets/logo2.png"; // круглое лого (по центру)

// 🔹 Enlaces reutilizables para el menú
const NavLinks = ({ isMobile = false, closeMenu }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const linkClass = ({ isActive }) =>
    `hover:text-[#C9A35C] transition-colors ${
      isActive ? "text-[#C9A35C]" : ""
    }`;

  return (
    <div
      className={`${
        isMobile
          ? "flex flex-col items-start gap-3 mt-4"
          : "flex items-center gap-6"
      } text-sm font-semibold tracking-wide`}
    >
      {/* 🔸 Nuevos enlaces */}
      <NavLink
        to="/planes"
        className={linkClass}
        onClick={isMobile ? closeMenu : undefined}
      >
        PLANES
      </NavLink>

      <NavLink
        to="/regala"
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

      {/* 🔸 Enlace a la página de suscripción */}
      <NavLink
        to="/app/subscription"
        className={linkClass}
        onClick={isMobile ? closeMenu : undefined}
        data-testid={isMobile ? "mobile-link-subscription" : "link-subscription"}
      >
        SUSCRIPCIÓN
      </NavLink>

      {/* 🔸 Estado de autenticación */}
      {isAuthenticated && user ? (
        <>
          {isMobile ? (
            <>
              <span data-testid="mobile-username">{user.name}</span>
              <button
                onClick={() => {
                  logout();
                  if (closeMenu) closeMenu();
                }}
                className="hover:text-[#C9A35C] transition-colors"
                data-testid="mobile-logout-button"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              className="hover:text-[#C9A35C] transition-colors"
              data-testid="logout-button"
            >
              LOGOUT
            </button>
          )}
        </>
      ) : (
        <NavLink
          to="/login"
          className={linkClass}
          onClick={isMobile ? closeMenu : undefined}
          data-testid={isMobile ? "mobile-link-login" : "link-login"}
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
        <Link to="/" aria-label="Ir al inicio" data-testid="link-home">
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
          data-testid="link-main"
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <img
            src={logo2}
            alt="Círculo dorado - Main"
            className="h-10 w-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* 🔹 Botón menú hamburguesa (solo móvil) */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="block md:hidden p-2 text-2xl"
          aria-label="Abrir o cerrar menú"
          data-testid="mobile-menu-button"
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
        <div className="md:hidden" data-testid="mobile-menu">
          <NavLinks isMobile closeMenu={() => setIsMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
