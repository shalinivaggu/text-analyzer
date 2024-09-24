import React, { useState, useEffect } from 'react';
import './index.css';

const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [uniqueWordCount, setUniqueWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [displayText, setDisplayText] = useState('');

  const [history, setHistory] = useState(['']); // History of text inputs
  const [historyIndex, setHistoryIndex] = useState(0); // Current index in history

  // Update history whenever text changes
  useEffect(() => {
    // Update history only if text is different from the current history item
    if (text !== history[historyIndex]) {
      const newHistory = [...history.slice(0, historyIndex + 1), text];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [text, history, historyIndex]);

  useEffect(() => {
    // Count unique words (case-insensitive)
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    setUniqueWordCount(uniqueWords.size);

    // Count characters excluding spaces and punctuation
    const chars = text.replace(/[\s\W_]/g, '').length;
    setCharCount(chars);
  }, [text]);

  const handleReplaceAll = () => {
    if (!searchTerm) return;

    // Perform replacement (case-sensitive) and update displayText
    const regex = new RegExp(searchTerm, 'g');
    const highlightedText = text.replace(regex, `<mark>${replaceTerm}</mark>`);
    setDisplayText(highlightedText);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setText(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setText(history[historyIndex + 1]);
    }
  };

  const handleReset = () => {
    setText('');
    setDisplayText('');
    setHistory(['']);
    setHistoryIndex(0);
    setSearchTerm('');
    setReplaceTerm('');
  };

  const createMarkup = (text) => {
    return { __html: text };
  };

  return (
    <div className="container">
      <div className="left-section">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="10"
          cols="50"
          placeholder="Type or paste your text here..."
        />
        <div className="stats">
          <p>Unique Words: {uniqueWordCount}</p>
          <p>Character Count (Excluding Spaces and Punctuation): {charCount}</p>
        </div>
        <div className="history-buttons">
          <button onClick={handleUndo} disabled={historyIndex === 0}>Undo</button>
          <button onClick={handleRedo} disabled={historyIndex === history.length - 1}>Redo</button>
          <button onClick={handleReset}>Reset</button>
        </div>

      </div>

      <div className="right-section">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search term"
        />
        <input
          type="text"
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
          placeholder="Replace term"
        />
        <button onClick={handleReplaceAll}>Replace All</button>

        <h3>Highlighted Text:</h3>
        <div 
          className="highlighted-text"
          dangerouslySetInnerHTML={createMarkup(displayText)} // Using displayText instead of text
        />
      </div>
    </div>
  );
};

export default TextAnalyzer;
