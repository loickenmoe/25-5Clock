import React from "react";
import "./index.css";
const defaultState = {
  breakNumber: 5 * 60,
  session: 25 * 60,
  minutes: 25 * 60,
  secondes: 0,
  status: "session pause",
  onBreak: false,
};

export default function App() {
  const [timer, setTimer] = React.useState(defaultState);
  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }
  function formatSessionBreak(time) {
    let minutes = Math.floor(time / 60);
    return minutes;
  }
  function increaseBreak() {
    if (timer.status === "session pause") {
      if (timer.breakNumber === 60 * 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            breakNumber: prevTimer.breakNumber + 60,
          };
        });
      }
    }
    if (timer.status === "session run") {
      return;
    }
    if (timer.status === "break pause") {
      if (timer.breakNumber === 60 * 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            breakNumber: prevTimer.breakNumber + 60,
            minutes: prevTimer.breakNumber + 60,
            secondes: 0,
          };
        });
      }
    }
    if (timer.status === "break run") {
      return;
    }
  }
  function decreaseBreak() {
    if (timer.status === "session pause") {
      if (timer.breakNumber === 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            breakNumber: prevTimer.breakNumber - 60,
          };
        });
      }
    }
    if (timer.status === "session run") {
      return;
    }
    if (timer.status === "break pause") {
      if (timer.breakNumber === 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            breakNumber: prevTimer.breakNumber - 60,
            minutes: prevTimer.breakNumber - 60,
            secondes: 0,
          };
        });
      }
    }
    if (timer.status === "break run") {
      return;
    }
  }
  function increaseSession() {
    if (timer.status === "session pause") {
      if (timer.session === 60 * 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            session: prevTimer.session + 60,
            minutes: prevTimer.session + 60,
            secondes: 0,
          };
        });
      }
    }
    if (timer.status === "session run") {
      return;
    }
    if (timer.status === "break pause") {
      if (timer.session === 60 * 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            session: prevTimer.session + 60,
          };
        });
      }
    }
    if (timer.status === "break run") {
      return;
    }
  }
  function decreaseSession() {
    if (timer.status === "session pause") {
      if (timer.session === 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            session: prevTimer.session - 60,
            minutes: prevTimer.session - 60,
            secondes: 0,
          };
        });
      }
    }
    if (timer.status === "session run") {
      return;
    }
    if (timer.status === "break pause") {
      if (timer.session === 60) {
        return;
      } else {
        setTimer((prevTimer) => {
          return {
            ...prevTimer,
            session: prevTimer.session - 60,
          };
        });
      }
    }
    if (timer.status === "break run") {
      return;
    }
  }
  function resetTimer() {
    let audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.pause();
    clearInterval(localStorage.getItem("interval-id"));
    setTimer(defaultState);
  }
  function controlTime() {
    let second = 1000;
    let onBreakVariable = timer.onBreak;
    if (timer.status === "session pause" || timer.status === "break pause") {
      let interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer.minutes <= 0 && !onBreakVariable) {
            onBreakVariable = true;
            let audio = document.getElementById("beep");
            audio.play();
            setTimer((prevoTimer) => {
              return {
                ...prevoTimer,
                onBreak: true,
              };
            });
            return {
              ...prevTimer,
              minutes: prevTimer.breakNumber,
            };
          } else if (prevTimer.minutes <= 0 && onBreakVariable) {
            onBreakVariable = false;
            let audio = document.getElementById("beep");
            audio.play();
            setTimer((prevoTimer) => {
              return {
                ...prevoTimer,
                onBreak: false,
              };
            });
            return {
              ...prevTimer,
              minutes: prevTimer.session,
            };
          }
          return {
            ...prevTimer,
            minutes: prevTimer.minutes - 1,
          };
        });
      }, 400);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    let nouveauStatus = timer.status;
    if (timer.status === "session pause") {
      nouveauStatus = "session run";
    } else if (timer.status === "break pause") {
      nouveauStatus = "break run ";
    }
    setTimer((prevTimer) => {
      return {
        ...prevTimer,
        status: nouveauStatus,
      };
    });
  }
  function stopTimer() {
    if (timer.status === "session run" || timer.status === "break run") {
      clearInterval(localStorage.getItem("interval-id"));
    }
    if (timer.status === "session run") {
      setTimer((prevTimer) => {
        return {
          ...prevTimer,
          status: "session pause",
        };
      });
    } else if (timer.status === "break run") {
      setTimer((prevTimer) => {
        return {
          ...prevTimer,
          status: "break pause",
        };
      });
    }
  }
  return (
    <main>
      <div className="body">
        <h1>25 + 5 Clock</h1>
        <div className="control">
          <div className="session-control">
            <h2 id="break-label">Break Length</h2>
            <div className="boutons">
              <i
                className="fa-solid fa-arrow-down"
                id="break-decrement"
                onClick={() => decreaseBreak()}
              ></i>
              <p id="break-length">{formatSessionBreak(timer.breakNumber)}</p>
              <i
                className="fa-solid fa-arrow-up"
                id="break-increment"
                onClick={() => increaseBreak()}
              ></i>
            </div>
          </div>
          <div className="session-control">
            <h2 id="session-label">Session Length</h2>
            <div className="boutons">
              <i
                className="fa-solid fa-arrow-down"
                id="session-decrement"
                onClick={() => decreaseSession()}
              ></i>
              <p id="session-length">{formatSessionBreak(timer.session)}</p>
              <i
                className="fa-solid fa-arrow-up"
                id="session-increment"
                onClick={() => increaseSession()}
              ></i>
            </div>
          </div>
        </div>
        <div className="session">
          <audio
            src="https://firebasestorage.googleapis.com/v0/b/react-notes-53866.appspot.com/o/Alarm%20sound%20effect.mp3?alt=media&token=9b95600d-84fb-44be-a3d7-55e49aa59242"
            id="beep"
          ></audio>

          <p className="session-name" id="timer-label">
            {timer.onBreak ? "Break" : "Session"}
          </p>
          <p className={"clock"} id="time-left">
            {formatTime(timer.minutes)}
          </p>
        </div>
        <div className="pause-play">
          <i
            id="start_stop"
            className={
              timer.status.includes("pause")
                ? "fa-solid fa-play"
                : "fa-solid fa-pause"
            }
            onClick={
              timer.status.includes("pause")
                ? () => controlTime()
                : () => stopTimer()
            }
          ></i>

          <i
            className="fa-solid fa-arrows-rotate"
            id="reset"
            onClick={() => resetTimer()}
          ></i>
        </div>

        <div className="author">
          <p>Designed and Coded by</p>
          <a href="#" className="link-author">
            Loïc Kenmoe
          </a>
        </div>
      </div>
    </main>
  );
}
