import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response: any) => {
    // Store the token and name in localStorage
    localStorage.setItem('google_token', response.credential);
    const userInfo = jwtDecode(response.credential);
    localStorage.setItem('google_name', userInfo.name);  // Save user's name
    navigate('/dashboard');  // Redirect to dashboard after successful login
  };

  const handleLoginFailure = () => {
    alert('Login Failed');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="absolute top-4 left-4 text-2xl font-bold text-gray-900">
        Xeno
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mt-12">
        <div className="text-center text-gray-700">
          <h1 className="text-3xl font-semibold">Welcome to CRM App</h1>
          <p className="mt-2 text-lg">Please sign in to continue</p>
        </div>
        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap
            theme="outline"
            shape="rectangular"
            size="large"
            clientId="652242303008-p8q9oo8sc7un0nb08v0i2g0dqv9emgkc.apps.googleusercontent.com"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
