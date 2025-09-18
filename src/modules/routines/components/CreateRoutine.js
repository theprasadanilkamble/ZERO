import React, { useState } from 'react';
import RoutineCube from './RoutineCube';
import './CreateRoutine.css';

const CreateRoutine = ({ onBack, onSave }) => {
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [routineCategory, setRoutineCategory] = useState('Build a Habit');
  const [cubes, setCubes] = useState([]);

  const cubeTypes = [
    { type: 'yesno', label: 'Yes/No Cube', icon: '✓✗' },
    { type: 'slider', label: 'Slider Cube', icon: '◀▬▬▶' },
    { type: 'dropdown', label: 'Dropdown Cube', icon: '▼' },
    { type: 'radio', label: 'Radio Cube', icon: '◉' },
    { type: 'text', label: 'Text Input Cube', icon: 'Aa' },
    { type: 'number', label: 'Number Cube', icon: '123' }
  ];

  const addCube = (type) => {
    const newCube = {
      id: Date.now(),
      type,
      title: `New ${type} cube`,
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      size: { width: 200, height: 120 },
      config: {}
    };
    setCubes([...cubes, newCube]);
  };

  const updateCube = (id, updates) => {
    setCubes(cubes.map(cube => 
      cube.id === id ? { ...cube, ...updates } : cube
    ));
  };

  const deleteCube = (id) => {
    setCubes(cubes.filter(cube => cube.id !== id));
  };

  const handleSave = () => {
    if (!routineTitle.trim()) {
      alert('Please enter a routine title');
      return;
    }

    const newRoutine = {
      title: routineTitle,
      description: routineDescription,
      category: routineCategory,
      cubes: cubes
    };

    onSave(newRoutine);
  };

  return (
    <div className="create-routine">
      <div className="create-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Create New Routine</h2>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="routine-form">
        <div className="form-group">
          <label>Routine Title</label>
          <input 
            type="text"
            value={routineTitle}
            onChange={(e) => setRoutineTitle(e.target.value)}
            placeholder="Enter routine title..."
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={routineDescription}
            onChange={(e) => setRoutineDescription(e.target.value)}
            placeholder="Describe your routine..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            value={routineCategory}
            onChange={(e) => setRoutineCategory(e.target.value)}
          >
            <option value="Build a Habit">Build a Habit</option>
            <option value="Quit a Habit">Quit a Habit</option>
            <option value="Add a Goal">Add a Goal</option>
            <option value="Create a Routine">Create a Routine</option>
          </select>
        </div>
      </div>

      <div className="cube-toolbar">
        <h3>Add Routino Cubes</h3>
        <div className="cube-types">
          {cubeTypes.map(cubeType => (
            <button 
              key={cubeType.type}
              className="cube-type-btn"
              onClick={() => addCube(cubeType.type)}
              title={cubeType.label}
            >
              <span className="cube-icon">{cubeType.icon}</span>
              <span className="cube-label">{cubeType.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cube-canvas">
        <div className="canvas-info">
          <p>Drag and resize your Routino Cubes below:</p>
        </div>
        
        <div className="canvas-area">
          {cubes.map(cube => (
            <RoutineCube
              key={cube.id}
              cube={cube}
              onUpdate={(updates) => updateCube(cube.id, updates)}
              onDelete={() => deleteCube(cube.id)}
            />
          ))}
          
          {cubes.length === 0 && (
            <div className="empty-canvas">
              <p>No cubes added yet. Select a cube type above to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;