import React from "react";
import './Timer.css'

const Timer = () => {
  const [time, setTime] = React.useState(0)
  const [timerOn, setTimeOn] = React.useState(false)

  React.useEffect(() => {
    let interval = null;

    if(timerOn) {
      interval = setInterval(() => {
        setTime(time => time + 1000)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    // Cleanup method
    return() => clearInterval(interval)
  }, [time, timerOn])

  return (
    <div className="Timer">
      <div>
        <span className={"clock"}>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span className={"clock"}>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
      </div>
      <div>
        {!timerOn && time === 0 && (
          <button className={"timer-btn"} onClick={()=>setTimeOn(true)}>Start</button>
        )}
        {timerOn && (
          <button className={"timer-btn"} onClick={()=>setTimeOn(false)}>Stop</button>
        )}
        {!timerOn && time !== 0 && (
          <button className={"timer-btn"} onClick={()=>setTimeOn(true)}>Resume</button>
        )}
        {!timerOn && time > 0 &&(
          <button className={"timer-btn"} onClick={()=>setTime(0)}>Reset</button>
        )}
      </div>
    </div>
  );
}

export default Timer;