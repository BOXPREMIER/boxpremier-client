import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthlyWines } from "@/services/monthlyWinesService";

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
    return <p className="text-center py-10 text-gray-600">Loading wines...</p>;

  const currentMonth = months[currentIndex];

  // Consideramos "november" y "december" como meses futuros/misteriosos
  const isFutureMonth = ["november", "december"].includes(currentMonth.month);

  // Capitaliza el nombre del mes para mostrarlo en pantalla
  const capitalizedMonth =
    currentMonth.month.charAt(0).toUpperCase() + currentMonth.month.slice(1);

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-6">
      {/* ---------- Header con mes y flechas ---------- */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full hover:bg-gray-100 transition"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-3xl font-bold tracking-wide text-center">
          {capitalizedMonth} 2025
        </h2>

        <button
          onClick={handleNext}
          className="p-3 rounded-full hover:bg-gray-100 transition"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* ---------- Carrusel de vinos ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {isFutureMonth
            ? [1, 2, 3].map((n) => (
                <motion.div
                  key={`placeholder-${n}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 rounded-2xl shadow-md p-8 flex flex-col items-center justify-center"
                >
                  <div className="text-6xl text-gray-400 font-bold">?</div>
                </motion.div>
              ))
            : currentMonth.wines.map((wine, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-[1.02]"
                >
                  <img
                    src={wine.image}
                    alt={wine.name}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{wine.name}</h3>
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
