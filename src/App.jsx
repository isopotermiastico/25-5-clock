import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [sessionLenght, setSessionLenght] = useState(3)
  const [breakLenght, setBreakLenght] = useState(5)
  const [timeLeft, setTimeLeft] = useState(sessionLenght)
  const [IsRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState("session")
  const [isInitialState, setInitialState] = useState(false) 

  const audioref = useRef(null)

  let seconds_interval_id;
  console.log()

  useEffect(() => 
    { 
      if (!IsRunning) 
        {
          return;
        }
      seconds_interval_id = setInterval(() => 
      {
        setTimeLeft(prev => 
        {
          if (prev <= 1)
            {
              audioref.current.play();
              if (mode === "session")
                {
                      setMode("break");
                      return breakLenght;
                }
              else if (mode === "break")
                {
                      setMode("session");
                      return sessionLenght;
                }
            }      
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(seconds_interval_id); 
      ;
    }, [timeLeft, IsRunning] )


    function convertSeconds(total_seconds)
    {
      const minutes = Math.floor(total_seconds / 60);
      const seconds = total_seconds % 60;
      const paddedSeconds = seconds.toString().padStart(2, "0");

      return `${minutes}:${paddedSeconds}`;
    }

  return (
    
    <div>
      <h1>25 + 5 Clock</h1>

      <div className="timer" style={{ color: (mode === "session" && isInitialState) ? 'green' : 'red' }}>
        {(mode === "session" && isInitialState) ? convertSeconds(timeLeft) : convertSeconds(sessionLenght)}
      </div>
      <div className="timer" id="breakTimer">
        {(mode === "break" && isInitialState) ? convertSeconds(timeLeft) : convertSeconds(breakLenght)}
      </div>

      <button onClick={() => {
        setIsRunning(!IsRunning);
        if (!isInitialState) {
          setInitialState(true);
          setTimeLeft(sessionLenght);
        };
        }}>
        {IsRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => {
        setIsRunning(false);
        setInitialState(false);
        setTimeLeft(sessionLenght);
        setMode("session");
        audioref.current.pause();
        audioref.current.currentTime = 0;
        }}>
        Reset
      </button>

      <div className="controls">
        <div>
          <h2>Session</h2>
          <button onClick={() =>{ 
            if (isInitialState) return;
            setSessionLenght(sessionLenght + 60);


          }}>+</button>
          <button onClick={() => { 
            if (isInitialState) return;
            setSessionLenght(sessionLenght - 60);

          }}>-</button>
        </div>
        <div>
          <h2>Break</h2>
          <button onClick={() => setBreakLenght(breakLenght + 60)}>+</button>
          <button onClick={() => setBreakLenght(breakLenght - 60)}>-</button>
        </div>
      </div>

      <audio
        ref={audioref}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />
    </div>
  )
}

export default App
