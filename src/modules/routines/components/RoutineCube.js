import React, { useState, useRef } from 'react';
import './RoutineCube.css';

const RoutineCube = ({ cube, onUpdate, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cubeRef = useRef(null);

  const handleDragStart = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    
    setIsDragging(true);
    const rect = cubeRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const canvas = cubeRef.current.parentElement;
    const canvasRect = canvas.getBoundingClientRect();
    
    const newX = e.clientX - canvasRect.left - dragStart.x;
    const newY = e.clientY - canvasRect.top - dragStart.y;
    
    onUpdate({
      position: { 
        x: Math.max(0, Math.min(newX, canvasRect.width - cube.size.width)),
        y: Math.max(0, Math.min(newY, canvasRect.height - cube.size.height))
      }
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTitleChange = (newTitle) => {
    onUpdate({ title: newTitle });
  };

  const renderCubeContent = () => {
    switch (cube.type) {
      case 'yesno':
        return (
          <div className="cube-content">
            <div className="yesno-buttons">
              <button className="yes-btn">Yes</button>
              <button className="no-btn">No</button>
            </div>
          </div>
        );
      
      case 'slider':
        return (
          <div className="cube-content">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="50"
              className="cube-slider"
            />
            <div className="slider-labels">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        );
      
      case 'dropdown':
        return (
          <div className="cube-content">
            <select className="cube-dropdown">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        );
      
      case 'radio':
        return (
          <div className="cube-content">
            <div className="radio-options">
              <label><input type="radio" name={`radio-${cube.id}`} /> Option A</label>
              <label><input type="radio" name={`radio-${cube.id}`} /> Option B</label>
              <label><input type="radio" name={`radio-${cube.id}`} /> Option C</label>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="cube-content">
            <input 
              type="text" 
              placeholder="Enter text..."
              className="cube-text-input"
            />
          </div>
        );
      
      case 'number':
        return (
          <div className="cube-content">
            <input 
              type="number" 
              placeholder="0"
              className="cube-number-input"
            />
          </div>
        );
      
      default:
        return <div className="cube-content">Unknown cube type</div>;
    }
  };

  return (
    <div 
      ref={cubeRef}
      className={`routine-cube ${cube.type}-cube ${isDragging ? 'dragging' : ''}`}
      style={{
        left: cube.position.x,
        top: cube.position.y,
        width: cube.size.width,
        height: cube.size.height
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="cube-header">
        <input 
          type="text"
          value={cube.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="cube-title-input"
          onClick={(e) => e.stopPropagation()}
        />
        <button 
          className="delete-cube-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ✕
        </button>
      </div>
      
      {renderCubeContent()}
      
      <div className="resize-handle"></div>
    </div>
  );
};

export default RoutineCube;