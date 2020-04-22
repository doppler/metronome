import React, { useState, useEffect, useCallback } from 'react';
import { Transport, Loop, MembraneSynth } from 'tone';
import './App.css';

const synth = new MembraneSynth({
  octaves: 1.08,
  pitchDecay: 0.0125,
  envelope: { release: 0.2 },
}).toMaster();

new Loop((time) => {
  synth.triggerAttackRelease('C5', '32n');
}, '4n').start(0);

function App() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setPlaying] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(null);

  const handleKeyPress = useCallback(({ key }) => {
    if (key === ' ') key = 'Space';
    console.log({ key });
    switch (key) {
      case 'ArrowUp':
        setBpm((value) => value + 1);
        break;
      case 'ArrowDown':
        setBpm((value) => value - 1);
        break;
      case 'ArrowRight':
        setBpm((value) => value + 10);
        break;
      case 'ArrowLeft':
        setBpm((value) => value - 10);
        break;
      case 'Space':
        togglePlay();
        break;
      default:
        break;
    }
    setButtonPressed(key);
    setTimeout(() => {
      setButtonPressed(null);
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    isPlaying ? Transport.start() : Transport.stop();
  }, [isPlaying]);

  useEffect(() => {
    Transport.bpm.value = bpm;
  }, [bpm]);

  const togglePlay = () => {
    setPlaying((prevState) => !prevState);
  };

  return (
    <div className='App'>
      <section>
        <h1>{bpm}</h1>
      </section>
      <section>
        <div className='controls-container'>
          <div
            className={`left-side Space button ${
              buttonPressed === 'Space' ? 'pressed' : null
            }`}
            onClick={() => handleKeyPress({ key: 'Space' })}
          >
            {isPlaying ? 'Stop' : 'Start'}
          </div>
          <div className='right-side'>
            <div className='blank'></div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowUp' })}
              className={`ArrowUp button ${
                buttonPressed === 'ArrowUp' ? 'pressed' : null
              }`}
            >
              {'\u25B2'} +1
            </div>
            <div className='blank'></div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowLeft' })}
              className={`ArrowLeft button ${
                buttonPressed === 'ArrowLeft' ? 'pressed' : null
              }`}
            >
              {`\u25C0`} -10
            </div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowDown' })}
              className={`ArrowDown button ${
                buttonPressed === 'ArrowDown' ? 'pressed' : null
              }`}
            >
              {'\u25BC'} -1
            </div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowRight' })}
              className={`ArrowRight button ${
                buttonPressed === 'ArrowRight' ? 'pressed' : null
              }`}
            >
              {'\u25B6'} +10
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
