import React, { useState, useEffect, useRef } from 'react';
import '../styles/NotesApp.css';

const NotesApp = ({ onSwitchToRoutines }) => {
  // State management
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome to Routino Notes",
      content: "Welcome to Routino Notes! ✨\n\nThis is your personal space for thoughts, ideas, and memories. \n\nStart typing to begin your note. Use the toolbar above to format your text. \n\nTry the privacy toggle below to blur sensitive content when you're not actively working on it.",
      date: "Today",
      active: true
    },
    {
      id: 2,
      title: "Personal Goals 2023",
      content: "1. Learn a new language\n2. Read 24 books\n3. Run a half marathon\n4. Start meditation practice",
      date: "Jun 12",
      active: false
    },
    {
      id: 3,
      title: "Book Recommendations",
      content: "To Read:\n- Atomic Habits by James Clear\n- Deep Work by Cal Newport\n- Sapiens by Yuval Noah Harari\n\nFavorites:\n- The Midnight Library by Matt Haig\n- Project Hail Mary by Andy Weir",
      date: "May 28",
      active: false
    }
  ]);

  const [blurEnabled, setBlurEnabled] = useState(true);
  const [todoMode, setTodoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Editor settings
  const [fontFamily, setFontFamily] = useState("'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
  const [fontSize, setFontSize] = useState('16');
  const [textAlign, setTextAlign] = useState('left');

  // Refs
  const editorRef = useRef(null);
  const titleInputRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  // Get active note
  const activeNote = notes.find(note => note.active);

  // Initialize app
  useEffect(() => {
    if (activeNote && editorRef.current) {
      editorRef.current.textContent = activeNote.content;
      updateWordCount();
      setTimeout(() => {
        processText();
      }, 100);
      
      if (titleInputRef.current) {
        autoResizeTextarea(titleInputRef.current);
      }
    }
  }, [activeNote?.id]);

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty('--notes-background-color', '#1e1e1e');
      root.style.setProperty('--notes-editor-bg', '#2d2d2d');
      root.style.setProperty('--notes-text-color', '#e0e0e0');
      root.style.setProperty('--notes-border-color', '#444444');
      root.style.setProperty('--notes-hover-color', '#3a3a3a');
      root.style.setProperty('--notes-shadow-color', 'rgba(0, 0, 0, 0.3)');
    } else {
      root.style.setProperty('--notes-background-color', '#f8f9fa');
      root.style.setProperty('--notes-editor-bg', '#ffffff');
      root.style.setProperty('--notes-text-color', '#333333');
      root.style.setProperty('--notes-border-color', '#e0e0e0');
      root.style.setProperty('--notes-hover-color', '#f0f2f5');
      root.style.setProperty('--notes-shadow-color', 'rgba(0, 0, 0, 0.1)');
    }
  }, [isDarkMode]);

  useEffect(() => {
    updateBlurState();
  }, [blurEnabled]);

  // Auto-resize textarea
  const autoResizeTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  };

  // Update word count
  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.textContent.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = text.length;
      setWordCount(words);
      setCharCount(chars);
    }
  };

  // Enhanced cursor position management
  const getCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || !editorRef.current) return 0;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    
    return preCaretRange.toString().length;
  };

  const setCursorPosition = (position) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    
    let charCount = 0;
    let walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    let found = false;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (charCount + nodeLength >= position) {
        const offset = position - charCount;
        range.setStart(node, Math.min(offset, nodeLength));
        range.setEnd(node, Math.min(offset, nodeLength));
        found = true;
        break;
      }
      charCount += nodeLength;
    }
    
    if (!found && editorRef.current.lastChild) {
      if (editorRef.current.lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(editorRef.current.lastChild, editorRef.current.lastChild.textContent.length);
        range.setEnd(editorRef.current.lastChild, editorRef.current.lastChild.textContent.length);
      } else {
        range.setStartAfter(editorRef.current.lastChild);
        range.setEndAfter(editorRef.current.lastChild);
      }
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Improved text processing
  const processText = () => {
    if (isProcessing || !editorRef.current) return;
    
    setIsProcessing(true);
    
    const cursorPosition = getCursorPosition();
    const textContent = editorRef.current.textContent;
    
    editorRef.current.innerHTML = '';
    
    const parts = textContent.split(/(\s+)/);
    
    parts.forEach(part => {
      if (/^\s+$/.test(part)) {
        editorRef.current.appendChild(document.createTextNode(part));
      } else if (part.length > 0) {
        const span = document.createElement('span');
        span.textContent = part;
        if (blurEnabled) {
          span.className = 'blurred';
          span.style.filter = 'blur(3px)';
        }
        editorRef.current.appendChild(span);
      }
    });
    
    requestAnimationFrame(() => {
      setCursorPosition(cursorPosition);
      setIsProcessing(false);
    });
  };

  // Update blur state for existing spans
  const updateBlurState = () => {
    if (!editorRef.current) return;
    
    const spans = editorRef.current.querySelectorAll('span');
    spans.forEach(span => {
      if (blurEnabled) {
        span.classList.add('blurred');
        span.style.filter = 'blur(3px)';
      } else {
        span.classList.remove('blurred');
        span.style.filter = 'none';
      }
    });
  };

  // Debounced processing for blur triggers
  const scheduleProcessing = (immediate = false) => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
    
    const delay = immediate ? 50 : 200;
    processingTimeoutRef.current = setTimeout(() => {
      if (!isProcessing) {
        processText();
      }
    }, delay);
  };

  // Note management functions
  const loadNote = (noteId) => {
    setNotes(prevNotes => 
      prevNotes.map(note => ({
        ...note,
        active: note.id === noteId
      }))
    );
  };

  const addNewNote = () => {
    const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const newNote = {
      id: newId,
      title: `New Note ${newId}`,
      content: '',
      date: dateStr,
      active: true
    };
    
    setNotes(prevNotes => [
      newNote,
      ...prevNotes.map(note => ({ ...note, active: false }))
    ]);
  };

  const deleteNote = (noteId) => {
    if (notes.length <= 1) {
      alert('Cannot delete the last note!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this note?')) {
      const noteIndex = notes.findIndex(n => n.id === noteId);
      const wasActive = notes[noteIndex].active;
      
      const updatedNotes = notes.filter(n => n.id !== noteId);
      
      if (wasActive && updatedNotes.length > 0) {
        updatedNotes[0].active = true;
      }
      
      setNotes(updatedNotes);
    }
  };

  const updateActiveNoteContent = (content) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.active ? { ...note, content } : note
      )
    );
  };

  const updateActiveNoteTitle = (title) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.active ? { ...note, title: title || `New Note ${note.id}` } : note
      )
    );
  };

  // Editor event handlers
  const handleEditorInput = (e) => {
    if (isProcessing) return;
    
    updateWordCount();
    updateActiveNoteContent(editorRef.current.textContent);
    
    const inputType = e.nativeEvent.inputType;
    const inputData = e.nativeEvent.data;
    
    if (inputType === 'insertText') {
      if (inputData === ' ') {
        scheduleProcessing(true);
      } else if (/[.,!?;:'"()[\]{}\-—–]/.test(inputData)) {
        scheduleProcessing(true);
      }
    } else if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
      scheduleProcessing(true);
    }
  };

  const handleEditorKeyDown = (e) => {
    if (todoMode && e.key === 'Enter') {
      e.preventDefault();
      setTimeout(() => {
        insertCheckboxAtCaret();
      }, 10);
      return;
    }
    
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormatting('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormatting('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormatting('underline');
          break;
      }
    }
  };

  // Formatting functions
  const handleFormatting = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  const insertCheckboxAtCaret = () => {
    const checkbox = '☐ ';
    document.execCommand('insertText', false, checkbox);
  };

  const handleTodoToggle = () => {
    setTodoMode(!todoMode);
    if (!todoMode) {
      insertCheckboxAtCaret();
    }
    editorRef.current.focus();
  };

  // Blur effect mouse handlers
  const handleMouseOver = (e) => {
    if (!blurEnabled || e.target.tagName !== 'SPAN') return;
    if (e.target.classList.contains('blurred')) {
      e.target.style.filter = 'none';
    }
  };

  const handleMouseOut = (e) => {
    if (!blurEnabled || e.target.tagName !== 'SPAN') return;
    if (e.target.classList.contains('blurred')) {
      e.target.style.filter = 'blur(3px)';
    }
  };

  const handleEditorClick = () => {
    if (!blurEnabled || !editorRef.current) return;
    
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const spans = editorRef.current.querySelectorAll('span.blurred');
        spans.forEach(span => {
          const range = selection.getRangeAt(0);
          if (range.intersectsNode(span)) {
            span.style.filter = 'none';
          } else {
            span.style.filter = 'blur(3px)';
          }
        });
      }
    }, 10);
  };

  const handleEditorKeyUp = () => {
    if (!blurEnabled || !editorRef.current) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const spans = editorRef.current.querySelectorAll('span.blurred');
      spans.forEach(span => {
        const range = selection.getRangeAt(0);
        if (range.intersectsNode(span)) {
          span.style.filter = 'none';
        } else {
          span.style.filter = 'blur(3px)';
        }
      });
    }
  };

  return (
    <div className="notes-app">
      {/* Header */}
      <header className="notes-app-header">
        <div className="notes-logo">
          <i className="fas fa-book logo-icon"></i>
          <span className="logo-text">Routino Notes</span>
        </div>
        <nav className="notes-app-nav">
          <button className="notes-nav-button">
            <i className="fas fa-search"></i> <span>Search</span>
          </button>
          {onSwitchToRoutines && (
            <button 
              className="notes-nav-button switch-btn"
              onClick={onSwitchToRoutines}
            >
              <i className="fas fa-heart"></i> <span>Switch to Routines</span>
            </button>
          )}
          <button className="notes-nav-button">
            <i className="fas fa-cog"></i> <span>Settings</span>
          </button>
        </nav>
      </header>

      <div className="notes-app-container">
        {/* Sidebar */}
        <aside className="notes-sidebar">
          <div className="notes-sidebar-header">
            <h3 className="notes-sidebar-title">My Notes</h3>
            <button className="notes-add-note-btn" onClick={addNewNote}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="notes-note-scroll">
            <ul className="notes-note-list">
              {notes.map(note => (
                <li 
                  key={note.id}
                  className={`notes-note-item ${note.active ? 'active' : ''}`}
                  onClick={() => loadNote(note.id)}
                >
                  <div className="notes-note-content">
                    <span className="notes-note-title">{note.title}</span>
                    <span className="notes-note-date">{note.date}</span>
                  </div>
                  <button 
                    className="notes-delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    title="Delete note"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="notes-main-content">
          <div className="notes-editor-container">
            {/* Toolbar */}
            <div className="notes-toolbar">
              <div className="notes-toolbar-group">
                <select 
                  value={fontFamily} 
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Default</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Georgia, serif">Georgia</option>
                </select>
                <select 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value)}
                >
                  <option value="12">12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                </select>
              </div>
              <div className="notes-toolbar-group">
                <select 
                  value={textAlign} 
                  onChange={(e) => setTextAlign(e.target.value)}
                >
                  <option value="left">Align Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
              <div className="notes-toolbar-group">
                <button onClick={() => handleFormatting('bold')} title="Bold (Ctrl+B)">
                  <i className="fas fa-bold"></i>
                </button>
                <button onClick={() => handleFormatting('italic')} title="Italic (Ctrl+I)">
                  <i className="fas fa-italic"></i>
                </button>
                <button onClick={() => handleFormatting('underline')} title="Underline (Ctrl+U)">
                  <i className="fas fa-underline"></i>
                </button>
              </div>
              <div className="notes-toolbar-group">
                <button onClick={() => handleFormatting('insertUnorderedList')} title="Bullet List">
                  <i className="fas fa-list-ul"></i>
                </button>
                <button onClick={() => handleFormatting('insertOrderedList')} title="Numbered List">
                  <i className="fas fa-list-ol"></i>
                </button>
                <button 
                  className={todoMode ? 'active' : ''} 
                  onClick={handleTodoToggle} 
                  title="Checkbox Mode"
                >
                  <i className="fas fa-check-square"></i>
                </button>
              </div>
              <div className="notes-toolbar-group">
                <button 
                  onClick={() => {
                    const url = prompt('Enter the image URL:');
                    if (url) {
                      document.execCommand('insertImage', false, url);
                    }
                  }}
                  title="Insert Image"
                >
                  <i className="fas fa-image"></i>
                </button>
                <button 
                  onClick={() => {
                    const url = prompt('Enter the link URL:');
                    if (url) {
                      document.execCommand('createLink', false, url);
                    }
                  }}
                  title="Insert Link"
                >
                  <i className="fas fa-link"></i>
                </button>
              </div>
              <div className="notes-theme-toggle">
                <span>Dark Mode</span>
                <label className="notes-toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode} 
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <span className="notes-slider"></span>
                </label>
              </div>
            </div>

            {/* Title Input */}
            <textarea
              ref={titleInputRef}
              className="notes-note-title-input"
              placeholder="Title"
              rows="1"
              value={activeNote?.title || ''}
              onChange={(e) => {
                updateActiveNoteTitle(e.target.value);
                autoResizeTextarea(e.target);
              }}
            />

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable={true}
              className="notes-editor"
              style={{
                fontFamily: fontFamily,
                fontSize: fontSize + 'px',
                textAlign: textAlign
              }}
              onInput={handleEditorInput}
              onKeyDown={handleEditorKeyDown}
              onKeyUp={handleEditorKeyUp}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={handleEditorClick}
              suppressContentEditableWarning={true}
            />

            {/* Status Bar */}
            <div className="notes-status-bar">
              <div className="notes-word-count">
                <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                <span>{charCount} characters</span>
              </div>
              <div className="notes-privacy-toggle">
                <span>Privacy Mode:</span>
                <label className="notes-toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={blurEnabled} 
                    onChange={() => setBlurEnabled(!blurEnabled)}
                  />
                  <span className="notes-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotesApp;