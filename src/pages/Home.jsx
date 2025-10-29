import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      
      {/* Hero Section */}
      <div className="w-full">
        <img 
          src="/public/vpmr2.jpg" 
          alt="Hero" 
          className="w-full h-auto object-cover block"
        />
      </div>

      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-0 py-0" // Sin padding vertical
      >
        <img 
          src="/public/bprhorizon.PNG" 
          alt="BoxPremier Logo" 
          className="block w-full max-w-screen-lg mx-auto m-0 align-top"
          // block: evita espacio inline
          // m-0: elimina márgenes
          // align-top: asegura que no quede espacio por line-height
        />
      </motion.div>

      {/* Intro Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mt-4 mb-6" // Reducido un poco el mt
      >
        <p className="text-2xl font-bold text-gray-800">Te brinda:</p>
      </motion.div>

      {/* Benefits Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col md:flex-row justify-around items-center gap-8 px-4 pb-12 max-w-6xl mx-auto"
      >
        {/* Shipping */}
        <div className="flex flex-col items-center text-center">
          <img 
            src="/shipping.png" 
            alt="Envío gratuito" 
            className="w-32 h-32 object-contain mb-4"
          />
          <p className="text-sm text-gray-700 font-bold">Envío gratuito</p>
        </div>

        {/* Easy Pay */}
        <div className="flex flex-col items-center text-center">
          <img 
            src="/easypay.png" 
            alt="Facilidad de pago" 
            className="w-32 h-32 object-contain mb-4"
          />
          <p className="text-sm text-gray-700 font-bold">Facilidad de pago y suscripción</p>
        </div>

        {/* Quality */}
        <div className="flex flex-col items-center text-center">
          <img 
            src="/quality.png" 
            alt="Productos de calidad" 
            className="w-32 h-32 object-contain mb-4"
          />
          <p className="text-sm text-gray-700 font-bold">Productos de calidad</p>
        </div>
      </motion.div>

      {/* Parallax Section */}
      <div ref={ref} className="relative w-full h-[400px] overflow-hidden mt-8">
        {/* Imagen con efecto parallax basado en scroll */}
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
        
        {/* Texto sobre la imagen */}
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
            {/* Customer Reviews Section */}
      <div className="mt-12 px-4 max-w-6xl mx-auto">
        <h2 
          className="text-center text-black font-bold text-3xl mb-6"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          Algunos comentarios de nuestros clientes Vino Premier
        </h2>

        {/* Carrusel */}
        <div className="overflow-x-auto flex gap-4 pb-4">
          {/* Comentario 1 */}
          <div 
            className="min-w-[300px] bg-white rounded-xl border border-[#AD946C] p-6 flex-shrink-0"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <p className="text-gray-800 mb-4">“Muy buena selección de vinos y envío rápido.”</p>
            <p className="text-sm text-gray-500">– María G.</p>
          </div>

          {/* Comentario 2 */}
          <div 
            className="min-w-[300px] bg-white rounded-xl border border-[#AD946C] p-6 flex-shrink-0"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <p className="text-gray-800 mb-4">“Excelente servicio al cliente y vino de calidad.”</p>
            <p className="text-sm text-gray-500">– Juan P.</p>
          </div>

          {/* Comentario 3 */}
          <div 
            className="min-w-[300px] bg-white rounded-xl border border-[#AD946C] p-6 flex-shrink-0"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <p className="text-gray-800 mb-4">“La suscripción vale la pena, gran descubrimiento mensual.”</p>
            <p className="text-sm text-gray-500">– Laura M.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
