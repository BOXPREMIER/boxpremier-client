import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Button from "../components/button"; 
import ScrollButton from "../components/ScrollButton"; 

export default function SuscriptionPage() {
  const heroRef = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "-60%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.05, 1.2]);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const robustScrollToPlanes = () => {
    const element = document.getElementById("planes");
    if (!element) {
      console.debug("[scrollToPlanes] elemento #planes no encontrado");
      return;
    }

    console.debug("[scrollToPlanes] intentanto scrollIntoView");
    
    try {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      console.debug("[scrollToPlanes] scrollIntoView falló:", e);
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset, behavior: "smooth" });
    }

    let attempts = 0;
    const maxAttempts = 8;

    const checkAndRetry = () => {
      attempts += 1;
      const rect = element.getBoundingClientRect();
      const inView = rect.top >= 0 && rect.top < window.innerHeight;
      console.debug(`[scrollToPlanes] intento ${attempts} rect.top=${rect.top} inView=${inView}`);
      if (inView || attempts >= maxAttempts) {
        if (!inView) {
          console.debug("[scrollToPlanes] última opción: anchor temporal");
          const a = document.createElement("a");
          a.href = "#planes";
          a.style.position = "absolute";
          a.style.left = "-9999px";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        return;
      }
      requestAnimationFrame(() => {
        setTimeout(checkAndRetry, 20);
      });
    };

    setTimeout(checkAndRetry, 20);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Parallax */}
      <div
        ref={heroRef}
        className="w-full relative bg-cover bg-center bg-no-repeat
                   min-h-[50vh] sm:min-h-[100vh] lg:min-h-[140vh] xl:min-h-[160vh]"
        style={{
          backgroundImage: "url('/vinosuscripcion.png')",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            scale: heroScale,
            y: heroY,
            opacity: 0.15,
          }}
        />

        <div className="absolute bottom-4 sm:bottom-12 left-4 sm:left-10 md:left-16 text-left text-black drop-shadow-lg max-w-[90%] sm:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
          <h1
            className="text-4xl sm:text-7xl md:text-8xl font-extrabold tracking-tight"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            <span className="font-light">B</span>
            O
            <span className="font-light">X</span>
            <span className="font-black">PREMIER</span>
          </h1>

          <p
            className="mt-4 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            Prueba increíbles vinos por solo <br/>30€ al mes!
          </p>

          <p
            className="mt-2 text-sm sm:text-[1.05rem] md:text-base font-light"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            Sin contratos, cancela cuando quieras.
          </p>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              title="Suscríbete"
              tooltip="Ir al formulario de suscripción"
              action={() => window.open("http://localhost:5173/app/Subscription/Checkout", "_blank")}
            />
            
            {/*  ScrollButton */}
            <ScrollButton />
          </div>
        </div>
      </div>

      {/* Sección debajo del hero */}
      <div id="planes" className="w-full py-16 px-4 text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          Planes creados para ti.
        </h2>
        <p
          className="mt-4 text-lg sm:text-xl font-light max-w-2xl mx-auto"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          Elige el que mejor acompañe tu estilo de disfrutar el vino. <br/>
          Paga como prefieras y cancela cuando quieras.
        </p>
      </div>

      {/* Sección de cuadros con detalles */}
      <div className="w-full py-12 flex flex-col sm:flex-row justify-center gap-6 px-4">
        {/* Primer cuadro + detalles */}
        <div className="w-full sm:w-80 flex flex-col items-center">
          <div className="relative border-[2px] border-[#AD946C] rounded-xl w-full cursor-pointer group transition-all duration-300">
            <div
              className="absolute top-0 left-0 w-full h-10 rounded-t-xl"
              style={{ backgroundColor: "rgba(173, 148, 108, 0.2)" }}
            ></div>
            <div
              className="absolute top-0 left-0 w-full h-10 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(173, 148, 108, 0.5)" }}
            ></div>

            <div className="p-6 pt-14 text-center relative">
              <p className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-semibold text-black whitespace-nowrap">
                Nuestro plan más popular
              </p>

              <h3
                className="text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: "Gotham, sans-serif" }}
              >
                <span className="font-light">B</span>
                <span className="font-extrabold ">O</span>
                <span className="font-light">X</span> <br />
                <span className="font-extrabold">PREMIER</span>
              </h3>

              <p
                className="text-[#AD946C] text-2xl font-bold mt-2"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Basic
              </p>
              <p className="text-black text-3xl font-semibold mt-1">30€</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="mt-4 text-left w-full">
            <p className="font-bold text-xl text-black mb-2">Incluye:</p>
            <ul className="text-gray-700 text-base list-disc list-inside space-y-1 mb-4">
              <li>Envío gratuito todos los meses.</li>
              <li>Cada mes recibirás una caja sorpresa con 3 botellas.</li>
              <li>Vinos de distintas regiones y denominaciones.</li>
              <li>Selección exclusiva de nuestros sumilleres, quienes eligen cada etiqueta para ofrecerte una experiencia distinta en cada entrega.</li>
            </ul>
            <Button
              title="Suscríbete"
              tooltip="Ir al formulario de suscripción"
              action={() => window.open("http://localhost:5173/app/Subscription/Checkout", "_blank")}
            />
          </div>
        </div>

        {/* Segundo cuadro + detalles */}
        <div className="w-full sm:w-80 flex flex-col items-center">
          <div className="relative border-[2px] border-[#AD946C] rounded-xl w-full cursor-pointer group transition-all duration-300">
            <div
              className="absolute top-0 left-0 w-full h-10 rounded-t-xl"
              style={{ backgroundColor: "rgba(173, 148, 108, 0.2)" }}
            ></div>
            <div
              className="absolute top-0 left-0 w-full h-10 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(173, 148, 108, 0.5)" }}
            ></div>

            <div className="p-6 pt-14 text-center relative">
              <p className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-semibold text-black whitespace-nowrap">
                Sube de nivel!
              </p>

              <h3
                className="text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: "Gotham, sans-serif" }}
              >
                <span className="font-light">B</span>
                <span className="font-extrabold ">O</span>
                <span className="font-light">X</span> <br />
                <span className="font-extrabold">PREMIER</span>
              </h3>

              <p
                className="text-[#AD946C] text-2xl font-bold mt-2"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Prestige
              </p>
              <p className="text-black text-3xl font-semibold mt-1">60€</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="mt-4 text-left w-full">
            <p className="font-bold text-xl text-black mb-2">Incluye:</p>
            <ul className="text-gray-700 text-base list-disc list-inside space-y-1 mb-4">
              <li>Envío gratuito mensual, directo a tu puerta.</li>
              <li>Cada mes recibirás una caja sorpresa con 3 botellas de alta gama y denominaciones premium.</li>
              <li>Vinos de distintas regiones y denominaciones.</li>
              <li>Selección exclusiva de nuestros sumilleres, con etiquetas de producción limitada y bodegas de renombre.</li>
              <li>Fichas de cata detalladas y recomendaciones de maridaje para cada vino.</li>
            </ul>
            <Button
              title="Suscríbete"
              tooltip="Ir al formulario de suscripción"
              action={() => window.open("http://localhost:5173/app/Subscription/Checkout", "_blank")}
            />
          </div>
        </div>

        {/* Tercer cuadro + detalles */}
        <div className="w-full sm:w-80 flex flex-col items-center">
          <div className="relative border-[2px] border-[#AD946C] rounded-xl w-full cursor-pointer group transition-all duration-300">
            <div
              className="absolute top-0 left-0 w-full h-10 rounded-t-xl"
              style={{ backgroundColor: "rgba(173, 148, 108, 0.2)" }}
            ></div>
            <div
              className="absolute top-0 left-0 w-full h-10 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(173, 148, 108, 0.5)" }}
            ></div>

            <div className="p-6 pt-14 text-center relative">
              <p className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-semibold text-black whitespace-nowrap">
                Comparte la emoción
              </p>

              <h3
                className="text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: "Gotham, sans-serif" }}
              >
                <span className="font-light">B</span>
                <span className="font-extrabold ">O</span>
                <span className="font-light">X</span> <br />
                <span className="font-extrabold">PREMIER</span>
              </h3>

              <p
                className="text-[#AD946C] text-2xl font-bold mt-2"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Regalo
              </p>
              <p className="text-black text-3xl font-semibold mt-1">30€</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="mt-4 text-left w-full">
            <p className="font-bold text-xl text-black mb-2">Incluye:</p>
            <ul className="text-gray-700 text-base list-disc list-inside space-y-1 mb-4">
              <li>Sorprende a alguien especial con una caja única de 3 botellas.</li>
              <li>Una sola entrega, sin suscripción.</li>
              <li>Envío gratuito directo a quien quieras regalarla.</li>
              <li>Vinos de distintas regiones y denominaciones.</li>
              <li>Selección exclusiva de nuestros sumilleres.</li>
              <li>Opción de tarjeta de regalo.</li>
            </ul>
            <Button
              title="Suscríbete"
              tooltip="Ir al formulario de suscripción"
              action={() => window.open("http://localhost:5173/app/Subscription/Checkout", "_blank")}
            />
          </div>
        </div>

      </div>

      {/* Sección FAQ / Respuestas */}
      <div className="w-full py-16 px-4">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Todo lo que necesitas saber</h2>

        {/* Tipos de Suscripción */}
        <div className="mb-4">
          <div
            className="cursor-pointer p-4 rounded-md mb-1 flex justify-between items-center"
            style={{ backgroundColor: "#AD946C69" }}
            onClick={() => toggleAccordion(0)}
          >
            <p className="font-semibold text-black">Tipos de Suscripción</p>
            <span className="text-black">{openIndex === 0 ? "▲" : "▼"}</span>
          </div>
          {openIndex === 0 && (
            <div className="px-4 py-2 text-gray-700 space-y-2">
              <p>En Vinopremier.com, creemos que disfrutar del vino debe ser una experiencia flexible, personalizada y sin complicaciones. Por eso, con BoxPremier te ofrecemos tres formas de vivir esta experiencia, adaptadas a tu estilo y preferencias.</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Suscripción Básica:</strong> Ideal para quienes desean iniciarse en el mundo del vino o disfrutar cada mes de nuevas etiquetas cuidadosamente seleccionadas. Recibirás vinos de excelente calidad, perfectos para el día a día, elegidos por nuestros expertos para sorprenderte en cada entrega. Se paga mensualmente y puedes cancelarla en cualquier momento, sin compromisos ni contratos.</li>
                <li><strong>Suscripción Prestige:</strong> Pensada para los paladares más exigentes. Con esta suscripción, recibirás vinos de gama alta y edición especial, seleccionados por nuestros enólogos entre bodegas destacadas. Cada caja es una experiencia única que combina elegancia, exclusividad y descubrimiento. También se paga mensualmente y puedes cancelarla cuando quieras.</li>
                <li><strong>BoxPremier Regalo:</strong> La opción perfecta para sorprender a alguien especial. Se trata de una caja única (pago único) con vinos de la misma categoría que la suscripción Básica, cuidadosamente presentada para regalar una experiencia inolvidable. No requiere renovación ni suscripción: compras, enviamos y haces feliz a un amante del vino.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Personaliza tu experiencia */}
        <div className="mb-4">
          <div
            className="cursor-pointer p-4 rounded-md mb-1 flex justify-between items-center"
            style={{ backgroundColor: "#AD946C69" }}
            onClick={() => toggleAccordion(1)}
          >
            <p className="font-semibold text-black">Personaliza tu experiencia</p>
            <span className="text-black">{openIndex === 1 ? "▲" : "▼"}</span>
          </div>
          {openIndex === 1 && (
            <div className="px-4 py-2 text-gray-700 space-y-2">
              <p>Tú eliges el tipo de vino que deseas recibir: Tinto, blanco, rosado o espumoso. Cada selección es una sorpresa exclusiva, cuidadosamente elegida por nuestros expertos para mantener la emoción y el descubrimiento en cada entrega.</p>
            </div>
          )}
        </div>

        {/* Mensaje final */}
        <p className="mt-4 text-gray-700 text-base font-bold">En BoxPremier, tú decides el ritmo. Sin contratos, sin complicaciones, solo vinos excepcionales que llegan directo a tu puerta.</p>
      </div>
    </div>
  );
}
