import React, { useState } from 'react';
import RoutineSwiper from './RoutineSwiper';
import CreateRoutine from './CreateRoutine';
import './RoutinesApp.css';

const RoutinesApp = ({ onSwitchToNotes }) => {
  const [currentView, setCurrentView] = useState('swiper'); // 'swiper' or 'create'
  const [routines, setRoutines] = useState([
    {
      id: 1,
      title: "Morning Workout",
      description: "Start your day with 30 minutes of exercise",
      category: "Build a Habit"
    },
    {
      id: 2,
      title: "Quit Social Media Scrolling",
      description: "Reduce mindless scrolling before bed",
      category: "Quit a Habit"
    },
    {
      id: 3,
      title: "Read 20 Pages Daily",
      description: "Finish 2 books this month",
      category: "Add a Goal"
    }
  ]);

  const handleCreateRoutine = () => {
    setCurrentView('create');
  };

  const handleBackToSwiper = () => {
    setCurrentView('swiper');
  };

  const handleAddRoutine = (newRoutine) => {
    setRoutines([...routines, { ...newRoutine, id: Date.now() }]);
    setCurrentView('swiper');
  };

  return (
    <div className="routines-app">
      <header className="routines-app-header">
        <h1 className="routines-app-title">Routino</h1>
        <p className="routines-app-subtitle">Build Better Habits</p>
        {onSwitchToNotes && (
          <button 
            className="switch-to-notes-btn"
            onClick={onSwitchToNotes}
          >
            <i className="fas fa-book"></i>
            <span>Switch to Notes</span>
          </button>
        )}
      </header>

      {currentView === 'swiper' ? (
        <RoutineSwiper 
          routines={routines}
          onCreateRoutine={handleCreateRoutine}
        />
      ) : (
        <CreateRoutine 
          onBack={handleBackToSwiper}
          onSave={handleAddRoutine}
        />
      )}
    </div>
  );
};

export default RoutinesApp;
