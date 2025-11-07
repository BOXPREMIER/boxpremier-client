import { useState } from "react";

const Button = ({ title, action, tooltip, type = "button", "data-testid": testid }) => {
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
        w-full md:w-auto
        px-10 py-4
        bg-secondary
        text-white uppercase tracking-wider
        transition-all duration-300 ease-out
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-secondary hover:scale-[1.02] cursor-pointer"}
        rounded-full shadow-md
        focus:outline-none focus:ring-2 focus:ring-secondary/50
      `}
      style={{
        fontFamily: "Gotham, sans-serif",
        fontWeight: 700, // Gotham Bold
        letterSpacing: "0.05em",
      }}
    >
      {loading ? "Cargando..." : title}
    </button>
  );
};

export default Button;
