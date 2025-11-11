// src/pages/GiftPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const GiftPage = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [fadeInText, setFadeInText] = useState(false);
  const [fadeInImages, setFadeInImages] = useState([false, false, false]);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const imagesRef = useRef([]);
  const navigate = useNavigate();

  // Maneja el parallax y fade-in
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);

      // Fade-in del texto
      if (textRef.current) {
        const top = textRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (top < windowHeight * 0.8) {
          setFadeInText(true);
        }
      }

      // Fade-in secuencial de imágenes
      imagesRef.current.forEach((img, index) => {
        if (img) {
          const top = img.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (top < windowHeight * 0.8) {
            setFadeInImages(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  const handleButtonClick = () => {
    navigate("/app/subscription/checkout");
  };

  return (
    <div className="bg-black text-white">
      {/* Hero con imagen completa y parallax */}
      <div className="relative w-full overflow-hidden">
        <img
          ref={imgRef}
          src="/public/bottlebox1.png"
          alt="Gift Hero"
          className="w-full h-auto block"
          style={{
            transform: `translateY(${offsetY * 0.3}px)`,
          }}
        />

        {/* Difuminado inferior fuerte */}
        <div className="absolute bottom-0 left-0 w-full h-[250px] bg-gradient-to-t from-black via-black/95 via-black/70 to-transparent pointer-events-none z-10" />

        {/* Texto superior */}
        <div className="absolute top-0 left-0 w-full flex flex-col items-center mt-12 space-y-6 px-4 text-center z-20">
          <p
            className="text-white"
            style={{
              fontFamily: "Gotham",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: "1.5rem",
            }}
          >
            Tres botellas. Un regalo inolvidable.
          </p>

          <h1
            className="text-white"
            style={{
              fontFamily: "Gotham",
              fontSize: "8rem",
              lineHeight: "1",
            }}
          >
            <span style={{ fontWeight: 300 }}>B</span>
            <span style={{ fontWeight: 900 }}>O</span>
            <span style={{ fontWeight: 300 }}>X </span>
            <span style={{ fontWeight: 900 }}>PREMIER</span>
          </h1>
        </div>
      </div>

      {/* Contenido debajo del hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center flex flex-col items-center space-y-8">
        <p
          className="text-white italic font-medium"
          style={{
            fontFamily: "Gotham",
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: "1.3rem",
            lineHeight: "2",
            maxWidth: "90%",
          }}
        >
          Esta caja de vinos no es solo un regalo, es una experiencia. Contiene
          tres botellas seleccionadas con cuidado por nuestros expertos, listas
          para disfrutar desde el primer descorche. Es el detalle perfecto para
          cumpleaños, aniversarios o cualquier ocasión que merezca celebrarse
          con estilo.
        </p>

        {/* Botón debajo del texto */}
        <div className="w-full md:w-auto">
          <Button
            title="Regala"
            tooltip="Ir al formulario de regalo"
            action={handleButtonClick}
          />
        </div>
      </div>

      {/* Sección con frase fade-in */}
      <div className="bg-black w-full flex justify-center py-24">
        <p
          ref={textRef}
          className={`text-white italic font-bold text-center transition-opacity duration-[1500ms] ease-out ${
            fadeInText ? "opacity-100" : "opacity-0"
          }`}
          style={{
            fontFamily: "Gotham",
            fontSize: "2rem",
            lineHeight: "1.5",
            maxWidth: "90%",
          }}
        >
          Haz de cada ocasión un brindis inolvidable.
        </p>
      </div>

      {/* Sección de imágenes con fade-in */}
      <div className="bg-black w-full flex flex-col items-center py-24">
        <div className="relative flex flex-col md:flex-row items-center justify-center md:space-x-8">
          <img
            ref={el => (imagesRef.current[0] = el)}
            src="/public/bottlehand.jpg"
            alt="Bottle Hand"
            className={`rounded-3xl transition-opacity duration-[5500ms] ease-out ${
              fadeInImages[0] ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxWidth: "300px", marginTop: "-40px" }}
          />

          <img
            ref={el => (imagesRef.current[1] = el)}
            src="/public/toast.jpg"
            alt="Toast"
            className={`rounded-3xl transition-opacity duration-[5500ms] ease-out ${
              fadeInImages[1] ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxWidth: "300px", marginTop: "300px" }}
          />

          <img
            ref={el => (imagesRef.current[2] = el)}
            src="/public/bottletable.jpg"
            alt="Bottle Table"
            className={`rounded-3xl transition-opacity duration-[5500ms] ease-out ${
              fadeInImages[2] ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxWidth: "300px", marginTop: "-260px" }}
          />
        </div>
      </div>

      {/* Nueva sección de texto */}
      <div className="bg-black w-full flex flex-col items-center px-6 pb-24 space-y-6">
        <div className="max-w-4xl text-center space-y-4">
          <p style={{ fontFamily: "Gotham", fontWeight: 600, fontStyle: "italic", fontSize: "1.5rem" }}>
            Regalar vino es regalar momentos.
          </p>
          <p style={{ fontFamily: "Gotham", fontWeight: 300, fontStyle: "italic", fontSize: "1.2rem", lineHeight: "1.8" }}>
            Nuestra exclusiva Caja de Vinos de Regalo ha sido diseñada para quienes valoran los detalles y el buen gusto.
          </p>
          <p style={{ fontFamily: "Gotham", fontWeight: 300, fontStyle: "italic", fontSize: "1.2rem", lineHeight: "1.8" }}>
            Cada caja incluye: tres vinos sorpresa cuidadosamente seleccionados por nuestros sommeliers, una tarjeta personalizada con tu mensaje especial, y envío gratuito directo al destinatario.
          </p>
          <p style={{ fontFamily: "Gotham", fontWeight: 300, fontStyle: "italic", fontSize: "1.2rem", lineHeight: "1.8" }}>
            Sorprende, emociona y brinda con elegancia. Haz de tu obsequio una experiencia única que se disfruta en cada copa.
          </p>
          <p style={{ fontFamily: "Gotham", fontWeight: 300, fontStyle: "italic", fontSize: "1.2rem", lineHeight: "1.8" }}>
            Haz clic y descubre más sobre esta experiencia exclusiva.
          </p>
        </div>

        {/* Botón "Regala" */}
        <div className="mt-8">
          <Button
            title="Regala"
            tooltip="Ir al formulario de regalo"
            action={handleButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default GiftPage;
