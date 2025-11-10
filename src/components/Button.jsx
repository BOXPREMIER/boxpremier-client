import { useState } from "react";

const Button = ({ title, action, tooltip, type = "button", "data-testid": testid, bgColor }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!action) return;
    setLoading(true);
    try {
      const result = await action();
      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type={type}
      title={tooltip}
      onClick={handleClick}
      disabled={loading}
      data-testid={testid}
      className={`
        w-full sm:w-auto
        px-6 sm:px-8 md:px-10
        py-3 sm:py-4
        ${!bgColor ? "bg-secondary text-white" : "text-white"} uppercase tracking-wider
        text-sm sm:text-base md:text-lg
        transition-all duration-300 ease-out
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"}
        rounded-full shadow-md
        focus:outline-none
      `}
      style={{
        fontFamily: "Gotham, sans-serif",
        fontWeight: 700,
        letterSpacing: "0.05em",
        backgroundColor: bgColor || undefined, 
      }}
    >
      {loading ? "Cargando..." : title}
    </button>
  );
};

export default Button;
