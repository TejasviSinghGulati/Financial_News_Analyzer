import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

// --- SVG Icons ---
const SendIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
  </svg>
);

const BotIcon = () => (
  <div className="assistant-avatar">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
    </svg>
  </div>
);

const UserIcon = () => (
  <div className="user-avatar">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  </div>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

const AttachIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
  </svg>
);

// --- Loading Animation ---
const LoadingDots = () => (
  <div className="loading-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// --- Source List Component ---
const SourceList = ({ sources }) => {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="sources-container">
      <h4 className="sources-title">Sources</h4>
      <div className="sources-list">
        {sources.map((source, index) => (
          <a 
            key={index} 
            href={source} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="source-link"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
            {new URL(source).hostname.replace('www.', '')}
          </a>
        ))}
      </div>
    </div>
  );
};

// --- Message Components ---
const AssistantMessage = ({ content, sources }) => (
  <div className="message-wrapper assistant-message-wrapper">
    <div className="message-container">
      <BotIcon />
      <div className="message-content assistant-content">
        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
        <SourceList sources={sources} />
      </div>
    </div>
  </div>
);

const UserMessage = ({ content }) => (
  <div className="message-wrapper user-message-wrapper">
    <div className="message-container">
      <UserIcon />
      <div className="message-content user-content">
        {content}
      </div>
    </div>
  </div>
);

// --- Input Form Component ---
const InputForm = ({ userQuery, setUserQuery, handleSubmit, isLoading, isWelcomeScreen }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [userQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`input-container ${isWelcomeScreen ? 'welcome-input' : ''}`}>
      {isWelcomeScreen && (
        <button className="input-icon plus-icon">
          <PlusIcon />
        </button>
      )}
      
      {!isWelcomeScreen && (
        <button className="input-icon attach-icon" type="button">
          <AttachIcon />
        </button>
      )}
      
      <textarea
        ref={textareaRef}
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input-textarea"
        placeholder="Ask anything..."
        rows={1}
        disabled={isLoading}
      />
      
      {!isWelcomeScreen && (
        <button className="input-icon mic-icon" type="button">
          <MicIcon />
        </button>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={isLoading || !userQuery.trim()}
        className="send-button"
        type="button"
      >
        <SendIcon />
      </button>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!userQuery.trim() || isLoading) return;

    const currentQuery = userQuery.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: currentQuery }]);
    setUserQuery("");
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: currentQuery, 
          profile: 'a retail investor' 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer, 
        sources: data.sources 
      }]);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch. Is the backend server running?";
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [userQuery, isLoading]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn">
            <PlusIcon />
            <span>New chat</span>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="chat-history-section">
            <div className="history-item active">
              Financial Analysis Chat
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="upgrade-btn">
            ⚡ Upgrade plan
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {chatHistory.length === 0 ? (
          // Welcome Screen
          <div className="welcome-screen">
            <h1 className="welcome-title">Where should we begin?</h1>
            <InputForm 
              userQuery={userQuery}
              setUserQuery={setUserQuery}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isWelcomeScreen={true}
            />
            <div className="suggestions-grid">
              <button 
                className="suggestion-card"
                onClick={() => setUserQuery("What are Apple's latest quarterly earnings?")}
              >
                <span className="suggestion-icon">📊</span>
                <span className="suggestion-text">Analyze latest earnings reports</span>
              </button>
              <button 
                className="suggestion-card"
                onClick={() => setUserQuery("What's the current state of the tech sector?")}
              >
                <span className="suggestion-icon">💻</span>
                <span className="suggestion-text">Tech sector analysis</span>
              </button>
              <button 
                className="suggestion-card"
                onClick={() => setUserQuery("How are inflation rates affecting markets?")}
              >
                <span className="suggestion-icon">📈</span>
                <span className="suggestion-text">Market & inflation insights</span>
              </button>
              <button 
                className="suggestion-card"
                onClick={() => setUserQuery("What are the best performing stocks today?")}
              >
                <span className="suggestion-icon">🎯</span>
                <span className="suggestion-text">Today's top performers</span>
              </button>
            </div>
          </div>
        ) : (
          // Chat Interface
          <>
            <div className="messages-container" ref={messagesContainerRef}>
              <div className="messages-inner">
                {chatHistory.map((msg, index) => (
                  msg.role === 'user' 
                    ? <UserMessage key={index} content={msg.content} />
                    : <AssistantMessage key={index} content={msg.content} sources={msg.sources} />
                ))}
                {isLoading && (
                  <div className="message-wrapper assistant-message-wrapper">
                    <div className="message-container">
                      <BotIcon />
                      <div className="message-content assistant-content">
                        <LoadingDots />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
            
            <div className="input-footer">
              <InputForm 
                userQuery={userQuery}
                setUserQuery={setUserQuery}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isWelcomeScreen={false}
              />
              <div className="footer-text">
                Financial Analyst AI can make mistakes. Verify important information.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;