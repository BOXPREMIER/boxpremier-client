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
        px-8 py-3
        bg-[#b49361] 
        text-white font-bold uppercase tracking-wider
        transition-all duration-300
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#a18150]"}
      `}
    >
      {loading ? "Cargando..." : title}
    </button>
  );
};

export default Button;
