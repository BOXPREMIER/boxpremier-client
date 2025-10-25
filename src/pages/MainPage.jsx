import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const leftBottles = ['b1.PNG', 'b2.PNG', 'b3.PNG'];
  const centerBottles = ['b4.PNG', 'b5.PNG', 'b6.PNG'];
  const rightBottles = ['b3.PNG', 'b2.PNG', 'b1.PNG'];

  const duplicate = (arr) => [...arr, ...arr];

  const bottleHeight = 640; // referencia
  const gap = 32;
  const totalHeight = duplicate(leftBottles).length * (bottleHeight + gap);

  return (
    <div
      className="relative min-h-screen w-full bg-white overflow-hidden font-sans cursor-pointer"
      onClick={() => navigate('/pages/home.jsx')}
    >
      {/* Carrusel de botellas */}
      <div className="absolute inset-0 z-20 pointer-events-none flex justify-center items-start">
        <div className="flex w-full max-w-7xl justify-around px-2 overflow-hidden">
          {/* Columna izquierda */}
          <motion.div
            className="flex flex-col gap-4 sm:gap-6 md:gap-8"
            animate={{ y: [0, -totalHeight / 2] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          >
            {duplicate(leftBottles).map((bottle, i) => (
              <img
                key={i}
                src={`/${bottle}`}
                alt={`Botella ${bottle}`}
                className="w-32 sm:w-40 md:w-48 lg:w-56 max-h-[80vh] h-auto object-contain drop-shadow-xl"
              />
            ))}
          </motion.div>

          {/* Columna central */}
          <motion.div
            className="flex flex-col gap-4 sm:gap-6 md:gap-8"
            animate={{ y: [0, -totalHeight / 2] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          >
            {duplicate(centerBottles).map((bottle, i) => (
              <img
                key={i}
                src={`/${bottle}`}
                alt={`Botella ${bottle}`}
                className="w-32 sm:w-40 md:w-48 lg:w-56 max-h-[80vh] h-auto object-contain drop-shadow-xl"
              />
            ))}
          </motion.div>

          {/* Columna derecha */}
          <motion.div
            className="flex flex-col gap-4 sm:gap-6 md:gap-8"
            animate={{ y: [0, -totalHeight / 2] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          >
            {duplicate(rightBottles).map((bottle, i) => (
              <img
                key={i}
                src={`/${bottle}`}
                alt={`Botella ${bottle}`}
                className="w-32 sm:w-40 md:w-48 lg:w-56 max-h-[80vh] h-auto object-contain drop-shadow-xl"
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-800 capitalize tracking-wide">
          ¿No sabes qué vino elegir?
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-700 capitalize mt-4">
          Elige
        </p>
        <img
          src="/bpr.PNG"
          alt="Box Premier Logo"
          className="w-48 sm:w-64 md:w-96 lg:w-[800px] mx-auto my-8 drop-shadow-xl"
        />
        <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-700 capitalize">
          ¡Y déjanos sorprenderte!
        </p>
      </div>
    </div>
  );
};

export default MainPage;
