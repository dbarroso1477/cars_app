import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const [view, setView] = useState('login'); // o 'register'
  const navigate = useNavigate();

  const handleLogin = (data) => {
    alert('Login completado');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/cars');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {view === 'login' ? 'Login' : 'Register'}
        </h2>

        {view === 'login' 
          ? <LoginForm onLogin={handleLogin} /> 
          : <RegisterForm />
        }

        <div className="mt-6 text-center">
          {view === 'login' ? (
            <>
              <span>Don't have an account?</span>{' '}
              <button onClick={() => setView('register')} className="text-blue-600 hover:underline">
                Register
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>{' '}
              <button onClick={() => setView('login')} className="text-blue-600 hover:underline">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
