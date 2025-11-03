import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Logo from "../assets/full-logo-white.png";
import logo2 from "../assets/logo2.png";

// 🔹 Componente reutilizable para los enlaces de navegación (desktop y móvil)
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
      {/* Enlace a la página de suscripción */}
      <NavLink
        to="/subscription"
        className={linkClass}
        onClick={isMobile ? closeMenu : undefined}
        data-testid={isMobile ? "mobile-link-subscription" : "link-subscription"}
      >
        SUSCRIPCIÓN
      </NavLink>

      {/* Autenticación: si el usuario está logueado o no */}
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

// 🔸 Componente principal del menú de navegación
const NavBar = ({ logo = Logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logotipo principal: redirige al inicio (/app) */}
        <Link to="/app" aria-label="Ir al inicio" data-testid="link-home">
          <img
            src={logo}
            alt="Vino Premier"
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Logotipo central (solo visible en pantallas medianas o grandes) */}
        <div className="hidden md:flex justify-center items-center">
          <NavLink
            to="/subscription"
            aria-label="Página de suscripción"
            data-testid="logo-subscription"
          >
            <img
              src={logo2}
              alt="Círculo dorado - Suscripción"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </NavLink>
        </div>

        {/* Botón menú hamburguesa (visible solo en móviles) */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="block md:hidden p-2 text-2xl"
          aria-label="Abrir o cerrar menú"
          data-testid="mobile-menu-button"
        >
          {isMenuOpen ? "Χ" : "☰"}
        </button>

        {/* Enlaces visibles en versión escritorio */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>
      </div>

      {/* Menú desplegable (solo visible en móviles) */}
      {isMenuOpen && (
        <div className="md:hidden" data-testid="mobile-menu">
          <NavLinks isMobile closeMenu={() => setIsMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
