import React from "react";

export default function ScrollButton({
  title = "Conoce los planes",
  tooltip = "Ver los planes disponibles",
}) {
  const handleScroll = () => {
    const element = document.getElementById("planes");
    if (element) {
      const yOffset = -50;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    } else {
      console.warn("⚠️ No se encontró el elemento con id='planes'");
    }
  };

  return (
    <button
      onClick={handleScroll}
      title={tooltip}
      className={`
        w-full sm:w-auto
        px-6 sm:px-8 md:px-10
        py-3 sm:py-4
        text-sm sm:text-base md:text-lg
        uppercase tracking-wider
        transition-all duration-300 ease-out
        hover:scale-[1.02] cursor-pointer
        rounded-full shadow-md
        focus:outline-none
      `}
      style={{
        fontFamily: "Gotham, sans-serif",
        fontWeight: 700,
        letterSpacing: "0.05em",
        backgroundColor: "#E1CEB270", 
        color: "#FFFFFF", 
      }}
    >
      {title}
    </button>
  );
}
