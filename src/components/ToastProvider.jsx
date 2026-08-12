import { Toaster } from 'react-hot-toast';

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      {/* Global toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          // Styling for all toasts
          style: {
            background: '#333',
            color: '#fff',
          },
          duration: 4000,
        }}
      />
    </>
  );
}
