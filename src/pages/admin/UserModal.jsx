import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { formatDate } from "../../utils/format";

/**
 * UserModal - formulario para crear/editar/ver usuario.
 * Props:
 * - open (bool)
 * - onClose (fn)
 * - onSubmit (fn) -> recibe datos del form
 * - initialData (obj) -> cuando es editar o ver
 * - readOnly (bool)
 *
 * Validaciones:
 * - email válido
 * - teléfono español (simple regex)
 */
const phoneRegexES = /^(?:\+34\s?)?(6|7|8|9)\d{8}$/;

const UserModal = ({ open, onClose, onSubmit, initialData = null, readOnly = false }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      street: "",
      number: "",
      floor: "",
      postalCode: "",
      city: "",
      province: "",
      country: "ES",
      status: true,
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        // si createdAt está, la mostramos no para editar:
        createdAtFormatted: initialData.createdAt ? formatDate(initialData.createdAt) : undefined,
      });
    } else {
      reset({});
    }
  }, [initialData, reset]);

  const submit = async (data) => {
    // quitar campos que no quieras mandar (ej: createdAtFormatted)
    const payload = { ...data };
    delete payload.createdAtFormatted;
    await onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{initialData ? (readOnly ? "Detalles de usuario" : "Editar usuario") : "Crear usuario"}</h2>
          <button onClick={onClose} className="text-gray-500">Cerrar</button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              {...register("email", {
                required: "El email es obligatorio",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Email inválido" }
              })}
              disabled={readOnly}
              className="w-full border rounded px-3 py-2"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm">Teléfono</label>
            <input
              {...register("phone", {
                pattern: { value: phoneRegexES, message: "Teléfono ES inválido" }
              })}
              disabled={readOnly}
              className="w-full border rounded px-3 py-2"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-sm">Nombre</label>
            <input {...register("firstName", { required: "Nombre obligatorio" })} disabled={readOnly} className="w-full border rounded px-3 py-2" />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="text-sm">Apellido</label>
            <input {...register("lastName", { required: "Apellido obligatorio" })} disabled={readOnly} className="w-full border rounded px-3 py-2" />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="text-sm">Calle</label>
            <input {...register("street")} disabled={readOnly} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm">Número</label>
            <input {...register("number")} disabled={readOnly} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm">Piso</label>
            <input {...register("floor")} disabled={readOnly} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm">Código postal</label>
            <input {...register("postalCode")} disabled={readOnly} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm">Ciudad</label>
            <input {...register("city")} disabled={readOnly} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm">Provincia</label>
            <input {...register("province")} disabled={readOnly} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("status")} disabled={readOnly} />
              <span className="text-sm">Activo</span>
            </label>

            {initialData?.createdAt && (
              <div className="text-xs text-gray-500 ml-auto">
                Creado: {initialData.createdAt ? formatDate(initialData.createdAt) : "-"}
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            {!readOnly && (
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
                {initialData ? "Guardar cambios" : "Crear usuario"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
