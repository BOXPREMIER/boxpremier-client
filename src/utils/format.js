import { format, parseISO } from "date-fns";

export const formatDate = (isoString) => {
  if (!isoString) return "-";
  try {
    return format(parseISO(isoString), "dd/MM/yyyy");
  } catch {
    return isoString;
  }
};

export const formatCurrency = (value) => {
  if (value == null) return "€0,00";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};
