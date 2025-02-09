import { toast } from 'react-toastify';

export const showToast = (message, type) => {
  if (type === 'success') {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT, // Position at the top right
      autoClose: 3000, // Auto close after 3 seconds
      hideProgressBar: false, // Show progress bar
      closeOnClick: true, // Close toast on click
      pauseOnHover: true, // Pause when hovered
      draggable: true, // Make draggable
      theme: "colored", // Theme for success
    });
  } else if (type === 'error') {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT, // Position at the top right
      autoClose: 5000, // Auto close after 5 seconds
      hideProgressBar: false, // Show progress bar
      closeOnClick: true, // Close toast on click
      pauseOnHover: true, // Pause when hovered
      draggable: true, // Make draggable
      theme: "dark", // Theme for error
    });
  }
};
