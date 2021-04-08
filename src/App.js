import React, { useState, useEffect } from "react";

const App = () => {
  const [session, setSession] = useState(25);
  const [rest, setRest] = useState(5);
  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [over, setOver] = useState(false);
  const [sessionTimer, setSessionTimer] = useState({
    minutes: session,
    seconds: 0,
  });
  const [restTimer, setRestTimer] = useState({
    minutes: rest,
    seconds: 0,
  });

  //Component did update to rerender when ever session or break is changed
  useEffect(() => {
    setSessionTimer({ minutes: session, seconds: 0 });
  }, [session]);

  useEffect(() => {
    setRestTimer({ minutes: rest, seconds: 0 });
  }, [rest]);

  //Session Timer function
  const Tick = () => {
    if (!start || pause) return false;
    if (sessionTimer.minutes === 0 && sessionTimer.seconds === 0) {
      setOver(true);
    } else if (sessionTimer.seconds === 0) {
      setSessionTimer({
        minutes: sessionTimer.minutes - 1,
        seconds: 59,
      });
      setRestTimer({
        minutes: rest,
        seconds: 0,
      });
    } else if (sessionTimer.minutes >= 0) {
      setSessionTimer({
        minutes: sessionTimer.minutes,
        seconds: sessionTimer.seconds - 1,
      });
    }
  };

  //Break Timer function
  const breakTick = () => {
    if (!start || pause) return false;
    if (restTimer.minutes === 0 && restTimer.seconds === 0) {
      setOver(false);
    } else if (restTimer.seconds === 0) {
      setRestTimer({
        minutes: restTimer.minutes - 1,
        seconds: 59,
      });
      setSessionTimer({
        minutes: session,
        seconds: 0,
      });
    } else if (restTimer.minutes >= 0) {
      setRestTimer({
        minutes: restTimer.minutes,
        seconds: restTimer.seconds - 1,
      });
    }
  };

  //Where the countdown magic actually happens. With the power of set interval. Runs either the session or the break function based on the over flag
  useEffect(() => {
    if (over) {
      let timerId = setInterval(() => breakTick(), 1000);

      return () => {
        return clearInterval(timerId);
      };
    } else {
      let timerId = setInterval(() => Tick(), 1000);

      return () => {
        return clearInterval(timerId);
      };
    }
  });

  //Increment and decrement buttons for the session and break states
  const incrementSession = () => {
    setSession(session + 1);
  };

  const decrementSession = () => {
    if (session > 1) {
      setSession(session - 1);
    }
  };
  const incrementBreak = () => {
    setRest(rest + 1);
  };

  const decrementBreak = () => {
    if (rest > 1) {
      setRest(rest - 1);
    }
  };

  //Reset function which reloads the page
  const handleReset = () => {
    window.location.reload();
  };

  //Content which shows either the session or break countdown based on the over flag
  let content = !over ? (
    <div>
      <h1 className="session-length-title">Session</h1>
      {`${sessionTimer.minutes
        .toString()
        .padStart(2, 0)}:${sessionTimer.seconds.toString().padStart(2, 0)}`}
    </div>
  ) : (
    <div style={{ color: "red" }}>
      <h1 className="session-length-title">Break</h1>
      {`${restTimer.minutes
        .toString()
        .padStart(2, 0)}:${restTimer.seconds.toString().padStart(2, 0)}`}
    </div>
  );

  return (
    <div className="ui container main-container">
      <h1 className="title">25 + 5 Clock</h1>
      <div className="length-controls">
        <div className="session">
          <h2>Session Length</h2>
          <i className="fas fa-arrow-up" onClick={incrementSession} />
          <span className="length">{session}</span>
          <i className="fas fa-arrow-down" onClick={decrementSession} />
        </div>
        <div className="break">
          <h2>Break Length</h2>
          <i className="fas fa-arrow-up" onClick={incrementBreak} />
          <span className="length">{rest}</span>
          <i className="fas fa-arrow-down" onClick={decrementBreak} />
        </div>
      </div>
      <div className="countdown-section">
        <div className="session-length">{content}</div>
        <div className="controls">
          <i className="fas fa-play" onClick={() => setStart(true)}></i>
          <i className="fas fa-pause" onClick={() => setPause(!pause)}></i>
          <i className="fas fa-sync-alt" onClick={handleReset}></i>
        </div>
      </div>
    </div>
  );
};

export default App;
