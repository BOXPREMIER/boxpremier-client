import React, { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube, ChevronUp } from "lucide-react";
import footerImg1 from "../assets/img/footer/footer_beta_2025_png-03.png";
import footerImg2 from "../assets/img/footer/footer-payments2_1.png";
import footerImg3 from "../assets/img/footer/logo-footer.png";

// -------------------- Newsletter Popup --------------------
function NewsletterPopup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Por favor, ingresa un correo válido");
      return;
    }
    alert(`¡Gracias por suscribirte! Email: ${email}`);
    setEmail("");
  };

  return (
    <div className="w-full max-w-sm bg-black text-white p-4 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <div className="inline-block bg-yellow-500 text-black px-3 py-1 font-bold mb-2 text-sm">
          5% DE DESCUENTO
        </div>
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
        <h2 className="text-lg font-bold mb-1">¡RECIBE NUESTRAS</h2>
        <h2 className="text-lg font-bold mb-1">MEJORES OFERTAS</h2>
        <h2 className="text-lg font-bold mb-2">DIRECTO EN TU E-MAIL!</h2>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-black outline-none rounded border border-gray-300"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          SUSCRIBIRSE
        </button>
      </form>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function VinoPremierNewsletter() {
  const leftLinks = [
    { text: "¿Quiénes somos?", href: "https://vinopremier.com/quienes-somos" },
    { text: "Nuestras tiendas", href: "https://vinopremier.com/vinotecas-vinopremier" },
    { text: "Espacio para eventos", href: "https://vinopremier.com/local-para-eventos-madrid" },
    { text: "Abre tu franquicia", href: "https://vinopremier.com/franquiciate" },
    { text: "Vender en Vinopremier", href: "https://vinopremier.com/sell-on-vinopremier" },
    { text: "Trabaja con nosotros", href: "https://vinopremier.com/trabaja-con-nosotros" },
    { text: "Programa de afiliados", href: "https://vinopremier.com/affiliate-program" },
  ];

  const rightLinks = [
    { text: "Contacto", href: "https://vinopremier.com/contact" },
    { text: "Ayuda - FAQ´s", href: "https://vinopremier.com/faqs-company" },
    { text: "Acceso Mayoristas", href: "https://vinopremier.com/customer/account/login" },
    { text: "Condiciones Generales de Compra", href: "https://vinopremier.com/condiciones-de-venta" },
    { text: "Política de Privacidad", href: "https://vinopremier.com/data-processing" },
    { text: "Gastos de Envío y Formas de Pago", href: "https://vinopremier.com/gastos-envio-vino-internacional" },
    { text: "Boxpremier - Nuestra Caja Sorpresa", href: "https://vinopremier.com/boxpremier" },
    { text: "Club de Vinos Valdeorite - Suscríbete", href: "https://vinopremier.com/club-de-vinos-valdeorite" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/Vinopremier?checkpoint_src=any" },
    { icon: Instagram, href: "https://www.instagram.com/vinopremier/" },
    { icon: Twitter, href: "https://x.com/Vinopremier" },
    { icon: Youtube, href: "https://www.youtube.com/c/Vinopremiercom" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1">{/* Основной контент */}</div>

      {/* Футер */}
      <footer className="w-full bg-gray-200 py-6 flex flex-col lg:flex-row items-start justify-center gap-6 px-4">
        {/* Left Column */}
        <div className="lg:w-1/4">
          <img src={footerImg3} alt="logo" className="h-16 w-auto object-contain mb-2" />
          <h3 className="font-bold mb-1 text-sm">SOBRE NOSOTROS</h3>
          <ul className="space-y-1">
            {leftLinks.map((link, i) => (
              <li key={i}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>

          <h3 className="font-bold mt-3 mb-1 text-sm">GARANTÍA DE VINOPREMIER</h3>
          <img src={footerImg1} alt="metodo del pago" className="h-16 w-auto object-contain mt-1" />
          <p className="text-sm text-gray-600 mt-2">
            <a href="https://vinopremier.com/plataforma-odr-para-la-resolucion-de-litigios-en-linea" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Plataforma ODR para la resolución de litigios en línea
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            "El consumo responsable es nuestra prioridad. Venta solo a mayores de edad."
          </p>
        </div>

        {/* Center Column - Newsletter */}
        <div className="lg:w-1/4 flex justify-center items-start">
          <NewsletterPopup />
        </div>

        {/* Right Column */}
        <div className="lg:w-1/4 lg:ml-4">
          <div className="flex gap-2 mb-2 justify-center lg:justify-start flex-wrap">
            {socialLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              );
            })}
          </div>
          <h3 className="font-bold mb-1 text-base text-center lg:text-left">ATENCIÓN AL CLIENTE</h3>
          <ul className="space-y-1 text-sm lg:text-base text-center lg:text-left">
            {rightLinks.map((link, i) => (
              <li key={i}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
          <img src={footerImg2} alt="vinos garantizados" className="h-20 w-auto object-contain mt-2 mx-auto lg:mx-0" />
        </div>
      </footer>

      {/* Scroll to top button */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-4 right-4 w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
