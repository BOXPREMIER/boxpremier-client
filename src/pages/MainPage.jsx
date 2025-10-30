import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const leftBottles = ['b1.PNG', 'b2.PNG', 'b3.PNG'];
  const centerBottles = ['b4.PNG', 'b5.PNG', 'b6.PNG'];
  const rightBottles = ['b7.PNG', 'b8.PNG', 'b9.PNG'];

  const duplicate = (arr) => [...arr, ...arr];

  return (
    <div
      className="relative min-h-screen w-full bg-white overflow-hidden font-gotham cursor-pointer"
      onClick={() => navigate('/Home')}
    >
      {/* Carrusel de botellas */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-start opacity-60">
        <div className="flex w-full max-w-7xl justify-around px-2 overflow-hidden">
          
          {/* Columna izquierda */}
          <motion.div
            className="flex flex-col gap-4 sm:gap-6 md:gap-8"
            animate={{ y: ['0%', '-50%'] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
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
            animate={{ y: ['0%', '-50%'] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
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
            animate={{ y: ['0%', '-50%'] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
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
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
        {/* Título - texto responsive */}
        <h1
          className="text-gray-800 font-light tracking-wide mb-2"
          style={{ fontSize: 'clamp(0.875rem, 2.5vw, 2rem)' }}
        >
          ¿No sabes qué vino elegir?
        </h1>

        {/* Subtítulo - texto responsive */}
        <p
          className="text-gray-700 font-light capitalize mb-4"
          style={{ fontSize: 'clamp(0.875rem, 2.5vw, 2rem)' }}
        >
          Elige
        </p>

        {/* Logo responsive */}
        <img
          src="/bpr.PNG"
          alt="Box Premier Logo"
          className="mx-auto drop-shadow-xl"
          style={{ 
            width: 'clamp(18rem, 45vw, 50rem)',
            height: 'auto',
            marginTop: 'clamp(0.5rem, 2vw, 1.5rem)',
            marginBottom: 'clamp(0.5rem, 2vw, 1.5rem)'
          }}
        />

        {/* Texto inferior */}
        <p
          className="text-gray-700 font-light mt-4"
          style={{ fontSize: 'clamp(0.875rem, 2.5vw, 2rem)' }}
        >
          ¡Haz clic y déjanos sorprenderte!
        </p>
      </div>
    </div>
  );
};

export default MainPage;
