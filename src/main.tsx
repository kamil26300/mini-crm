import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="652242303008-p8q9oo8sc7un0nb08v0i2g0dqv9emgkc.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
  </StrictMode>
);
