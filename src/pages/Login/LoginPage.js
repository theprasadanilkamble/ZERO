import React from 'react';
import './LoginPage.css';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="login-page">
      <header className="main-app-header login-header">
        <div className="app-logo">
          <i className="fas fa-infinity logo-icon"></i>
          <span className="logo-text">Routino</span>
        </div>
      </header>

      <main className="login-content">
        <div className="login-card">
          <div className="login-hero">
            <h1>Welcome back</h1>
            <p>Build better habits and capture your thoughts with Routino.</p>
          </div>

          <div className="login-actions">
            <button className="nav-btn login-google" onClick={loginWithGoogle}>
              <i className="fab fa-google"></i>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="login-footnote">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> and{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;