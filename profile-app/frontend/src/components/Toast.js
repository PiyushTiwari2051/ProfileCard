import React, { useEffect } from 'react';

/**
 * Toast component for showing notifications.
 * Auto-dismisses after 3500ms.
 * 
 * @param {Object} props
 * @param {string} props.message - The notification message.
 * @param {'success'|'error'} props.type - The type of toast.
 * @param {Function} props.onClose - Callback to run when closing the toast.
 */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const toastClass = type === 'success' ? 'toast-success' : 'toast-error';

  return (
    <div className={`toast ${toastClass}`} role="status" aria-live="polite">
      {type === 'success' ? (
        // Success checkmark icon
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        // Error alert icon
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}

export default Toast;
