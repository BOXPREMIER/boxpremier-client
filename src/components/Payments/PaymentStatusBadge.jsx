const PaymentRowActions = ({ paymentId, payment, isAdmin, onView, onUpdateStatus, compact }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onView}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver
      </button>
      
      {isAdmin && payment.status === 'pending' && (
        <>
          <button
            onClick={() => onUpdateStatus(paymentId, 'completed')}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Aprobar
          </button>
          <button
            onClick={() => onUpdateStatus(paymentId, 'failed')}
            className="text-[] hover:text-red-800 font-medium"
          >
            Rechazar
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentRowActions;