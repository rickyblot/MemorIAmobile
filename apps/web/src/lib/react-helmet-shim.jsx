// Compatibility shim: react-helmet is not safe with React 18 concurrent updates.
// Re-export the async-safe API under the same import path used across the app.
export { Helmet, HelmetProvider } from 'react-helmet-async';
export { Helmet as default } from 'react-helmet-async';
