import React, { useState } from 'react';
import RoutinesApp from './modules/routines/pages/RoutinesApp';
import NotesApp from './modules/notes/pages/NotesApp';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const [currentModule, setCurrentModule] = useState('routines'); // 'routines' or 'notes'

  const switchToModule = (module) => {
    setCurrentModule(module);
  };

  if (user === undefined) {
    return <div className="routino-main-app">Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="routino-main-app">
      {/* Navigation Header */}
      <header className="main-app-header">
        <div className="app-logo">
          <i className="fas fa-infinity logo-icon"></i>
          <span className="logo-text">Routino</span>
        </div>
        
        <nav className="module-nav">
          <button 
            className={`nav-btn ${currentModule === 'routines' ? 'active' : ''}`}
            onClick={() => switchToModule('routines')}
          >
            <i className="fas fa-heart"></i>
            <span>Routines</span>
          </button>
          <button 
            className={`nav-btn ${currentModule === 'notes' ? 'active' : ''}`}
            onClick={() => switchToModule('notes')}
          >
            <i className="fas fa-book"></i>
            <span>Notes</span>
          </button>
          <button className="nav-btn" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {/* Module Content */}
      <div className="module-container">
        {currentModule === 'routines' ? (
          <RoutinesApp onSwitchToNotes={() => switchToModule('notes')} />
        ) : (
          <NotesApp onSwitchToRoutines={() => switchToModule('routines')} />
        )}
      </div>
    </div>
  );
}

export default App;
