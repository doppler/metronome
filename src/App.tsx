import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import './App.css';

const synth = new Tone.MembraneSynth({
  octaves: 1.08,
  pitchDecay: 0.0125,
  envelope: { release: 0.2 },
}).toDestination();

const initialSequence = new Tone.Sequence(
  (time, note) => {
    synth.triggerAttackRelease(note, '32n');
  },
  ['E6', 'C6', 'C6', 'C6'],
  '4n'
);

function App() {
  const [haveSatisfiedUserInteraction, setSatisfiedUserInteraction] = useState(
    false
  );
  const [bpm, setBpm] = useState(120);
  const [stepCount, setStepCount] = useState(4);
  const sequence = useRef(initialSequence);
  const [isPlaying, setPlaying] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loop = useRef(
    new Tone.Loop((time) => {
      // synth.triggerAttackRelease('C6', '32n', time);
      sequence.current.start(time);
    }, '1n').start()
  );

  const togglePlay = useCallback(() => {
    // satisfy browser's requirement for user interaction
    // so AudioContext will be allowed to start
    if (!haveSatisfiedUserInteraction) {
      Tone.start();
      setSatisfiedUserInteraction((prevState) => !prevState);
    }
    setPlaying((prevState) => !prevState);
  }, [haveSatisfiedUserInteraction]);

  const handleKeyPress = useCallback(
    ({ key }) => {
      // rename ' ' key to Space so we can use it as a
      // className target in the DOM
      if (key === ' ') key = 'Space';
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
    },
    [togglePlay]
  );

  useEffect(() => {
    const bpm = window.localStorage.getItem('bpm');
    if (bpm) setBpm(Number(bpm));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    isPlaying ? Tone.Transport.start() : Tone.Transport.stop();
  }, [isPlaying]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    window.localStorage.setItem('bpm', bpm.toString());
  }, [bpm]);

  useEffect(() => {
    sequence.current.events = ['E6', ...Array(stepCount - 1).fill('C6')];
  }, [stepCount]);

  const handleStepCountChange = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    setStepCount(Number(event.currentTarget.value));
  };

  return (
    <div className='App'>
      <section>
        <div className='bpm-display'>{bpm}</div>
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
          <div>{stepCount}</div>
          <div>
            {isPlaying ? null : (
              <input
                onChange={handleStepCountChange}
                className='stepCount'
                type='range'
                min={2}
                max={8}
                value={stepCount}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
