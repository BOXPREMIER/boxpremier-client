import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star } from 'lucide-react';

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // 🔹 Hero Section
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "-60%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.05, 1.2]);
  const backgroundOpacity = useTransform(heroScroll, [0.1, 0.8], [0, 1]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      
      {/* 🔹 Hero Section */}
      <div
        ref={heroRef}
        className="w-full h-[120vh] relative bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/public/vpmr3.jpg')",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            scale: heroScale,
            y: useTransform(heroScroll, [0, 1], ["0%", "-10%"]),
            opacity: 0.1, // 🔸 Fondo con 10% de opacidad
          }}
        />

        {/* 🔸 Difuminado inferior */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-transparent to-white"></div>

        {/* 🔹 Texto sobre el fondo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.p 
            className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            El arte del vino en cada botella
          </motion.p>
          <motion.p 
            className="text-xl md:text-2xl italic text-white drop-shadow-md"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Experiencias que despiertan los sentidos
          </motion.p>
        </div>
      </div>

      {/* 🔸 Sección que va cubriendo la imagen con fondo blanco */}
      <motion.div
        style={{
          backgroundColor: useTransform(backgroundOpacity, [0, 1], ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]),
          transition: "background-color 0.6s ease-out",
        }}
      >
        {/* 🔹 Texto "BOX PREMIER" en lugar del logo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-0 py-0 text-center mt-12 md:mt-20"
        >
          <h1 
            className="text-5xl md:text-7xl font-extrabold text-black tracking-wide"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            B<span className="text-[#AD946C]">O</span>X PREMIER
          </h1>
        </motion.div>

        {/* 🔹 Intro Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-4 mb-6"
        >
          <p className="text-2xl font-bold text-gray-800">Te brinda:</p>
        </motion.div>

        {/* 🔹 Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-around items-center gap-8 px-4 pb-12 max-w-6xl mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <img 
              src="/shipping.png" 
              alt="Envío gratuito" 
              className="w-32 h-32 object-contain mb-4"
            />
            <p className="text-sm text-gray-700 font-bold">Envío gratuito</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img 
              src="/easypay.png" 
              alt="Facilidad de pago" 
              className="w-32 h-32 object-contain mb-4"
            />
            <p className="text-sm text-gray-700 font-bold">Facilidad de pago y suscripción</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img 
              src="/quality.png" 
              alt="Productos de calidad" 
              className="w-32 h-32 object-contain mb-4"
            />
            <p className="text-sm text-gray-700 font-bold">Productos de calidad</p>
          </div>
        </motion.div>

        {/* 🔹 Parallax Section */}
        <div ref={ref} className="relative w-full h-[400px] overflow-hidden mt-8">
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
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p 
              className="text-3xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Desde los viñedos, directo a tu copa
            </p>
            <p 
              className="text-lg md:text-2xl italic"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Tradición, pasión y sabor en cada sorbo
            </p>
          </div>
        </div>

        {/* 🔹 Customer Reviews Section */}
        <div className="mt-12 px-4 max-w-6xl mx-auto">
          <h2 
            className="text-center text-black font-bold text-3xl mb-6"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Algunos comentarios de nuestros clientes Vino Premier
          </h2>

          <div className="overflow-x-auto flex gap-4 pb-4">
            {[
              { text: "“Muy buena selección de vinos y envío rápido.”", author: "– María G." },
              { text: "“Excelente servicio al cliente y vino de calidad.”", author: "– Juan P." },
              { text: "“La suscripción vale la pena, gran descubrimiento mensual.”", author: "– Laura M." },
            ].map((review, i) => {
              const [rating, setRating] = useState(5); // valor inicial: 5 estrellas

              return (
                <div 
                  key={i}
                  className="min-w-[300px] bg-white rounded-xl border border-[#AD946C] p-6 flex-shrink-0"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {/* ⭐ Estrellas interactivas */}
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
                          className="w-6 h-6 mr-1 transition-transform hover:scale-110"
                        />
                      </button>
                    ))}
                  </div>

                  <p className="text-gray-800 mb-4">{review.text}</p>
                  <p className="text-sm text-gray-500">{review.author}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
