import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthlyWines } from "../services/MonthlyWines";
import { Link } from "react-router-dom";

export default function MonthlyWines() {
  const [months, setMonths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyWines();

        const monthOrder = [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ];

        const sorted = data.sort(
          (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
        );

        setMonths(sorted);
      } catch (error) {
        console.error("Error loading monthly wines:", error);
      }
    };
    fetchData();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? months.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === months.length - 1 ? 0 : prev + 1));
  };

  if (months.length === 0)
    return (
      <p className="text-center py-10 text-gray-500 font-gotham text-lg">
        Loading wines...
      </p>
    );

  const currentMonth = months[currentIndex];
  const isFutureMonth = ["november", "december"].includes(currentMonth.month);
  const capitalizedMonth =
    currentMonth.month.charAt(0).toUpperCase() + currentMonth.month.slice(1);

  const transitionVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white font-[var(--font-gotham)]">
      
      {/* ---------- SECCIÓN PARALLAX ---------- */}
      <div
        className="relative w-full h-[100vh] bg-fixed bg-center bg-cover flex items-center justify-center mb-16"
        style={{
          backgroundImage: "url('/public/OldBox.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative text-white text-3xl sm:text-5xl font-extrabold text-center max-w-3xl px-4 z-10"
        >
          Conoce el contenido de nuestras ediciones anteriores
        </motion.h2>
      </div>

      {/* ---------- Header con mes y flechas ---------- */}
      <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full hover:bg-[#AB9470]/10 transition"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-8 h-8 text-[#AB9470]" />
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-wide text-center">
          {capitalizedMonth} 2025
        </h2>

        <button
          onClick={handleNext}
          className="p-3 rounded-full hover:bg-[#AB9470]/10 transition"
          aria-label="Next month"
        >
          <ChevronRight className="w-8 h-8 text-[#AB9470]" />
        </button>
      </div>

      {/* ---------- Carrusel ---------- */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentMonth.month}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
        >
          {isFutureMonth
            ? [1, 2, 3].map((n) => (
                <div
                  key={`placeholder-${n}`}
                  className="bg-gray-100 rounded-2xl shadow-md p-8 flex flex-col items-center justify-center aspect-square"
                >
                  <div className="text-6xl text-gray-400 font-bold">?</div>
                </div>
              ))
            : currentMonth.wines.map((wine, i) => {
                const hasExternalLink =
                  wine.link && wine.link.startsWith("http");
                const internalLink = `/app/wine/${currentMonth.month}/${i}`;

                const Card = (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-transform duration-300 aspect-[3/4]"
                  >
                    <img
                      src={wine.image}
                      alt={wine.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
                      <h3 className="text-white text-lg sm:text-xl font-semibold tracking-wide">
                        {wine.name}
                      </h3>
                    </div>
                  </motion.div>
                );

                return hasExternalLink ? (
                  <a
                    key={i}
                    href={wine.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {Card}
                  </a>
                ) : (
                  <Link key={i} to={internalLink} className="block">
                    {Card}
                  </Link>
                );
              })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
