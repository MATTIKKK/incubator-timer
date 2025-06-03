import React, { useState, useEffect, useRef } from 'react';
import './pages.css';

const MainPage = () => {
  const [selectedTime, setSelectedTime] = useState(10);
  const [time, setTime] = useState(10);
  const [name, setName] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            playSound();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const playSound = () => {
    // Создаем простой звуковой сигнал
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const startTimer = () => {
    if (name.trim()) {
      setTime(selectedTime);
      setIsRunning(true);
      setIsCompleted(false);
    }
  };

  const resetTimer = () => {
    setTime(selectedTime);
    setIsRunning(false);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Создаем массив опций от 1 до 60 секунд
  const timeOptions = Array.from({ length: 60 }, (_, i) => i + 1);

  return (
    <div className="main-page">
      <div className="timer-card">
        <h1 className="timer-title">Timer</h1>

        <div className="input-container">
          <label htmlFor="nickName">Write your name, beauty</label>
          <input
            type="text"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
            disabled={isRunning}
            name="nickName"
          />

          <label htmlFor="timeSelect">Choose timer duration (seconds)</label>
          <select
            id="timeSelect"
            value={selectedTime}
            onChange={(e) => {
              const newTime = parseInt(e.target.value);
              setSelectedTime(newTime);
              if (!isRunning) {
                setTime(newTime);
              }
            }}
            className="time-select"
            disabled={isRunning}
          >
            {timeOptions.map((seconds) => (
              <option key={seconds} value={seconds}>
                {seconds} {seconds === 1 ? 'second' : 'seconds'}
              </option>
            ))}
          </select>
        </div>

        <div className={`timer-display ${time <= 3 ? 'warning' : ''}`}>
          {time}
        </div>

        {isCompleted && (
          <div className="completion-message">🎉 Ты справился, {name}! 🎉</div>
        )}

        <div className="button-container">
          <button
            onClick={startTimer}
            disabled={isRunning || !name.trim()}
            className="timer-button start-button"
          >
            {isRunning ? 'Идет...' : 'Старт'}
          </button>

          <button onClick={resetTimer} className="timer-button reset-button">
            Сброс
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
