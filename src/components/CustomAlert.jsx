// // CustomAlert.jsx
// import React from "react";
// import ReactDOM from "react-dom";

// const CustomAlertModal = ({ title, text, confirmText, onConfirm }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//     <div className="bg-white rounded-lg p-6 max-w-md w-full">
//       <h3 className="text-lg font-semibold mb-2">{title}</h3>
//       <p className="mb-4">{text}</p>
//       <div className="flex justify-end">
//         <button
//           onClick={onConfirm}
//           className="px-4 py-2 bg-secondary text-white rounded"
//         >
//           {confirmText || "Aceptar"}
//         </button>
//       </div>
//     </div>
//   </div>
// );

// let containerEl = null;

// export const showCustomAlert = ({ title, text, confirmText, onConfirm }) => {
//   if (!containerEl) {
//     containerEl = document.createElement("div");
//     document.body.appendChild(containerEl);
//   }

//   const handleClose = () => {
//     if (containerEl) {
//       ReactDOM.unmountComponentAtNode(containerEl);
//     }
//     if (typeof onConfirm === "function") onConfirm();
//   };

//   ReactDOM.render(
//     <CustomAlertModal
//       title={title}
//       text={text}
//       confirmText={confirmText}
//       onConfirm={handleClose}
//     />,
//     containerEl
//   );
// };
