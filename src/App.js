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
      <div>
        <h1>{bpm}</h1>
        <button onClick={togglePlay}>{isPlaying ? 'Stop' : 'Start'}</button>
      </div>
    </div>
  );
}

export default App;
