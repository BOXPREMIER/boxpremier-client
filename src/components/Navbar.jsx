import Logo from "../assets/Logo.png"; 
import logo2 from "../assets/logo2.png"
import { useState, useEffect } from "react"; 
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";

const NavBar = ({ logo = Logo }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation(); 
//   const navigate = useNavigate();

//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const user = useAuthStore((state) => state.user);
//   const logout = useAuthStore((state) => state.logout);

//   useEffect(() => setIsMenuOpen(false), []);

//   const handleToggleMenu = () => setIsMenuOpen(prev => !prev);

  const links = [
    { label: "Home", to: "/Logo.png" },
    { label: "/subscriptionPage", to: "../assets/logo2.png" },
    // {label:"loginPage", to:"/login"}
    // { label: "Idioma", to: "/" },
    
  ];



  return (
    <nav className="w-full bg-black text-white flex items-center justify-between px-6 py-3">
      {/* Lado izquierdo: logo */}
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Vino Premier"
          className="h-8 w-auto"
        />
      </div>

      {/* Centro: círculo dorado */}
      <div className="flex justify-center items-center">
        <img
          src={logo2}
          alt="Circulo dorado"
          className="h-8 w-auto"
        />
      </div>

      {/* Lado derecho: login e idioma */}
      <div className="flex items-center gap-6 text-sm font-semibold tracking-wide">
        <NavLink
        //   to="/login"
          className="hover:text-[#C9A35C] transition-colors"
        >
          LOGIN
        </NavLink>
        <button className="flex items-center gap-1 hover:text-[#C9A35C] transition-colors">
          <span>IDIOMA</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
