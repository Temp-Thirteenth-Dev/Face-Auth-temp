import React, { useState, useEffect } from 'react';
import { UserPlus, LogIn, Camera, ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import CameraView from './components/CameraView';
import './index.css';

const App = () => {
  const [mode, setMode] = useState('home'); // 'home', 'register', 'login'
  const [status, setStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleBack = () => {
    setMode('home');
    setStatus('');
    setUserName('');
    setIsNameSubmitted(false);
  };

  return (
    <div className="container">
      <div className="glass-card">
        {mode === 'home' && (
          <>
            <h1 className="title">Face Login</h1>
            <p className="subtitle">Simple and secure access for everyone</p>

            <div className="grid">
              <button className="btn-large" onClick={() => setMode('register')}>
                <UserPlus size={48} color="#818cf8" />
                <span>New User</span>
              </button>
              <button className="btn-large" onClick={() => setMode('login')}>
                <LogIn size={48} color="#c084fc" />
                <span>Sign In</span>
              </button>
            </div>

            <div className="disclaimer">
              This face authentication system is for awareness and accessibility purposes only and is not intended for high-security use.
            </div>
          </>
        )}

        {(mode === 'register' || mode === 'login') && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                <ArrowLeft size={24} />
              </button>
              <h2 style={{ margin: 0 }}>{mode === 'register' ? 'Register Face' : 'Logging In'}</h2>
            </div>

            {mode === 'register' && !isNameSubmitted && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '10px' }}>What is your name?</p>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0,0,0,0.2)',
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}
                />
                <button
                  className="btn-primary"
                  disabled={!userName.trim()}
                  onClick={() => setIsNameSubmitted(true)}
                >
                  Continue
                </button>
              </div>
            )}

            {(mode === 'login' || (mode === 'register' && isNameSubmitted)) && (
              <CameraView
                mode={mode}
                name={userName}
                onSuccess={(msg) => {
                  setStatus(msg);
                  speak(msg);
                  setTimeout(() => handleBack(), 3000);
                }}
                onError={(err) => {
                  setStatus(err);
                  speak(err);
                }}
                status={status}
              />
            )}

            <p style={{ marginTop: '20px', color: '#94a3b8' }}>{status}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
