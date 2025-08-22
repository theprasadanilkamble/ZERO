import React, { useState, useRef } from 'react';
import './RoutineSwiper.css';

const RoutineSwiper = ({ routines, onCreateRoutine }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const currentRoutine = routines[currentIndex];

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    const { x, y } = dragOffset;

    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe
      if (x > threshold) {
        handleSwipe('right'); // Yes
      } else if (x < -threshold) {
        handleSwipe('left'); // No
      }
    } else {
      // Vertical swipe
      if (y < -threshold) {
        handleSwipe('up'); // Skip
      } else if (y > threshold) {
        handleSwipe('down'); // Pass
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on:`, currentRoutine?.title);
    
    // Move to next routine
    if (currentIndex < routines.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Build a Habit": "#4CAF50",
      "Quit a Habit": "#F44336",
      "Add a Goal": "#2196F3",
      "Create a Routine": "#FF9800"
    };
    return colors[category] || "#9C27B0";
  };

  return (
    <div className="routine-swiper">
      <div className="swipe-instructions">
        <div className="instruction">
          <span className="arrow">←</span>
          <span>No</span>
        </div>
        <div className="instruction">
          <span className="arrow">↑</span>
          <span>Skip</span>
        </div>
        <div className="instruction">
          <span className="arrow">→</span>
          <span>Yes</span>
        </div>
        <div className="instruction">
          <span className="arrow">↓</span>
          <span>Pass</span>
        </div>
      </div>

      <div className="card-container">
        {currentRoutine ? (
          <div 
            ref={cardRef}
            className={`routine-card ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
            }}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches.clientY)}
            onTouchMove={(e) => handleMove(e.touches.clientX, e.touches.clientY)}
            onTouchEnd={handleEnd}
          >
            <div 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(currentRoutine.category) }}
            >
              {currentRoutine.category}
            </div>
            
            <h2 className="routine-title">{currentRoutine.title}</h2>
            <p className="routine-description">{currentRoutine.description}</p>
            
            <div className="card-progress">
              <span>{currentIndex + 1} / {routines.length}</span>
            </div>
          </div>
        ) : (
          <div className="no-routines">
            <h3>No routines available!</h3>
            <p>Create your first routine to get started.</p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="action-btn no-btn" onClick={() => handleSwipe('left')}>
          ✕
        </button>
        <button className="action-btn skip-btn" onClick={() => handleSwipe('up')}>
          ↑
        </button>
        <button className="action-btn yes-btn" onClick={() => handleSwipe('right')}>
          ♥
        </button>
        <button className="action-btn pass-btn" onClick={() => handleSwipe('down')}>
          ↓
        </button>
      </div>

      <button className="create-routine-btn" onClick={onCreateRoutine}>
        + Create Routine
      </button>
    </div>
  );
};

export default RoutineSwiper;
