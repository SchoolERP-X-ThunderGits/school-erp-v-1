const isDev = import.meta.env.VITE_NODE_ENV === 'development';
const isLocal = import.meta.env.VITE_NODE_ENV === 'local';
const isProd = import.meta.env.VITE_NODE_ENV === 'production';

// ------------------------
// BASE URL Selection
// ------------------------
let BASE_URL = import.meta.env.VITE_DEV_BASE_URL;

if (isProd) {
    BASE_URL = import.meta.env.VITE_PROD_BASE_URL;
} else if (isLocal) {
    BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL;
} else if (isDev) {
    BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
}

// ------------------------
// Razorpay Key Selection
// ------------------------
let RAZORPAY_SUPER_KEY = import.meta.env.VITE_DEV_RAZORPAY_SUPER_KEY;

if (isProd) {
    RAZORPAY_SUPER_KEY = import.meta.env.VITE_PROD_RAZORPAY_SUPER_KEY;
} else if (isLocal) {
    RAZORPAY_SUPER_KEY = import.meta.env.VITE_LOCAL_RAZORPAY_SUPER_KEY;
} else if (isDev) {
    RAZORPAY_SUPER_KEY = import.meta.env.VITE_DEV_RAZORPAY_SUPER_KEY;
}

export { BASE_URL, RAZORPAY_SUPER_KEY };
