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

  const handleKeyPress = useCallback(({ key, keyCode }) => {
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
      default:
        break;
    }
    if (keyCode === 32) togglePlay();
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
          <div className='left-side spacebar button' onClick={togglePlay}>
            {isPlaying ? 'Stop' : 'Start'}
          </div>
          <div className='right-side'>
            <div className='blank'></div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowUp' })}
              className='arrow-key button ArrowUp'
            >
              {'\u25B2'} +1
            </div>
            <div className='blank'></div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowLeft' })}
              className='arrow-key button ArrowLeft'
            >
              {`\u25C0`} -10
            </div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowDown' })}
              className='arrow-key button ArrowDown'
            >
              {'\u25BC'} -1
            </div>
            <div
              onClick={() => handleKeyPress({ key: 'ArrowRight' })}
              className='arrow-key button ArrowRight'
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
