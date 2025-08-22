import React, { useState } from 'react';
import RoutinesApp from './components/RoutinesApp';
import NotesApp from './components/NotesApp';
import './App.css';

function App() {
  const [currentModule, setCurrentModule] = useState('routines'); // 'routines' or 'notes'

  const switchToModule = (module) => {
    setCurrentModule(module);
  };

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
