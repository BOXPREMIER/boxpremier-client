// src/components/ui/CustomAlert.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showCustomAlert = ({
  title = "¿Estás seguro?",
  text = "Esta acción no se puede revertir.",
  confirmText = "Sí, continuar",
  cancelText = "Cancelar",
  imageUrl = "/logo-vinopremier.png",
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  MySwal.fire({
    title: `<span style="font-family: Gotham; font-weight: 700;">${title}</span>`,
    text: text,
    imageUrl,
    imageWidth: 80,
    imageHeight: 80,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: "custom-alert-popup",
      confirmButton: "custom-alert-confirm",
      cancelButton: "custom-alert-cancel",
      title: "custom-alert-title",
      htmlContainer: "custom-alert-text",
    },
    buttonsStyling: false, // Importante para aplicar nuestro propio CSS
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      MySwal.fire({
        title: `<span style="font-family: Gotham; font-weight: 700;">¡Hecho!</span>`,
        text: "La acción se realizó correctamente.",
        icon: "success",
        customClass: {
          popup: "custom-alert-popup",
          confirmButton: "custom-alert-confirm",
        },
        buttonsStyling: false,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      onCancel();
    }
  });
};
