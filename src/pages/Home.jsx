import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

 
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "-60%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.05, 1.2]);
  const backgroundOpacity = useTransform(heroScroll, [0.1, 0.8], [0, 1]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Gotham, sans-serif' }}>
      
      {/* 🔹 Hero Section */}
      <div
        ref={heroRef}
        className="w-full h-[100vh] sm:h-[110vh] md:h-[120vh] relative bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/public/vpmr3.jpg')",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            scale: heroScale,
            y: useTransform(heroScroll, [0, 1], ["0%", "-10%"]),
            opacity: 0.1,
          }}
        />

        {/*  Difuminado inferior */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-transparent to-white"></div>

        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
          <motion.p 
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg leading-tight"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            El arte del vino en cada botella
          </motion.p>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl italic text-white drop-shadow-md max-w-[90%] sm:max-w-[80%] md:max-w-[60%]"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            Experiencias que despiertan los sentidos
          </motion.p>
        </div>
      </div>

      
      <motion.div
        style={{
          backgroundColor: useTransform(backgroundOpacity, [0, 1], ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]),
          transition: "background-color 0.6s ease-out",
        }}
      >
        {/* 🔹 Texto "BOX PREMIER" */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-4 sm:px-6 text-center mt-8 sm:mt-12 md:mt-20"
        >
         <h1 
         className="text-[3.5rem] sm:text-[6rem] md:text-[9rem] font-extrabold text-black tracking-wide leading-none"
         style={{ fontFamily: 'Gotham, sans-serif' }}
        >
         <span style={{ fontWeight: 200 }}>B</span>O<span style={{ fontWeight: 300 }}>X</span> PREMIER
         </h1>
        </motion.div>


        {/* 🔹 Intro Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-4 mb-6 px-4 sm:px-8"
        >
          <p className="text-xl sm:text-2xl font-light text-gray-800">Te brinda:</p>
        </motion.div>

        {/* 🔹 Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-around items-center gap-8 px-4 sm:px-6 md:px-8 pb-12 max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <img 
              src="/shipping.png" 
              alt="Envío gratuito" 
              className="w-24 sm:w-28 md:w-32 h-auto object-contain mb-4"
            />
            <p className="text-sm sm:text-base text-gray-700 font-bold">Envío gratuito</p>
          </div>

          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <img 
              src="/easypay.png" 
              alt="Facilidad de pago" 
              className="w-24 sm:w-28 md:w-32 h-auto object-contain mb-4"
            />
            <p className="text-sm sm:text-base text-gray-700 font-bold text-center px-2">Facilidad de pago y suscripción</p>
          </div>

          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <img 
              src="/quality.png" 
              alt="Productos de calidad" 
              className="w-24 sm:w-28 md:w-32 h-auto object-contain mb-4"
            />
            <p className="text-sm sm:text-base text-gray-700 font-bold">Productos de calidad</p>
          </div>

          {/*  Nuevo bloque: Opciones de regalo */}
          <div className="flex flex-col items-center text-center w-full md:w-1/3">
            <img 
              src="/gift.png" 
              alt="Opciones de regalo" 
              className="w-24 sm:w-28 md:w-32 h-auto object-contain mb-4"
            />
            <p className="text-sm sm:text-base text-gray-700 font-bold">Opciones de regalo</p>
          </div>
        </motion.div>

        {/*  Botón "Conoce más" */}
        <div className="flex justify-center mt-8 mb-12">
          <Button
            title="Conoce más"
            tooltip="Ir a la página de suscripción"
            action={() => navigate("/app/subscription")} 
          />
        </div>

        {/*  Parallax Section */}
        <div ref={ref} className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden mt-8">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/grapefield.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.7,
              y
            }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6">
            <p 
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 leading-tight"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              Desde los viñedos, directo a tu copa
            </p>
            <p 
              className="text-base sm:text-lg md:text-2xl italic max-w-[90%] sm:max-w-[80%] md:max-w-[60%]"
              style={{ fontFamily: 'Gotham, sans-serif' }}
            >
              Tradición, pasión y sabor en cada sorbo
            </p>
          </div>
        </div>

        {/*  Customer Reviews Section */}
        <div className="mt-12 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
          <h2 
            className="text-center text-black font-bold text-2xl sm:text-3xl mb-6"
            style={{ fontFamily: 'Gotham, sans-serif' }}
          >
            Algunos comentarios de nuestros clientes Vino Premier
          </h2>

          
          <div className="overflow-x-auto flex gap-4 pb-4 snap-x snap-mandatory scroll-smooth">
            {[
              { text: "“Muy buena selección de vinos y envío rápido.”", author: "– María G." },
              { text: "“Excelente servicio al cliente y vino de calidad.”", author: "– Juan P." },
              { text: "“La suscripción vale la pena, gran descubrimiento mensual.”", author: "– Laura M." },
            ].map((review, i) => {
              const [rating, setRating] = useState(5);

              return (
                <div 
                  key={i}
                  className="min-w-[260px] sm:min-w-[300px] bg-white rounded-xl border border-[#AD946C] p-4 sm:p-6 flex-shrink-0 snap-start"
                  style={{ fontFamily: 'Gotham, sans-serif' }}
                >
                  {/*  Estrellas interactivas */}
                  <div className="flex justify-start mb-3 text-[#AD946C]">
                    {[...Array(5)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setRating(index + 1)}
                        className="focus:outline-none"
                      >
                        <Star
                          fill={index < rating ? "#AD946C" : "none"}
                          stroke="#AD946C"
                          className="w-5 sm:w-6 h-5 sm:h-6 mr-1 transition-transform hover:scale-110"
                        />
                      </button>
                    ))}
                  </div>

                  <p className="text-gray-800 mb-4 text-sm sm:text-base">{review.text}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{review.author}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
