import { useProgress } from "@react-three/drei"
import { usePlay } from "../contexts/Play"

const Overlay = () => {

  const {progress} = useProgress()

  const {play, setPlay, hasScroll, end} = usePlay()

  return (
    <div className={`overlay ${play && !end ? "overlay--disable" : ""} ${hasScroll ? "overlay--scrolled" : ""}`}>
      {/* <div className={`loader ${progress === 100 ? "loader--disappear": ''}`} /> */}

        <div className={`intro ${play ? "hide-intro" : ""} ${progress === 100 ? "loaded" : ""}`}>
          <div className="overlay-container">
            <div className="loaded-percent">
              <span>{progress.toFixed(0)}% Loaded</span>
            </div>
            <h1 className="align-right">
              Detect <strong>Risk</strong>
            </h1>
            <p className="align-right subhead">Drone Technology for Remote Inspection</p>
            <div className="verticals">
              <p>Wind</p>
              <p>Solar</p>
              <p>Gas</p>
            </div>
            <button 
              className="explore"
              onClick={() => setPlay(true)}
            >Explore</button>
          </div>


        </div>
      <p className={`intro__scroll ${play && !end ? "show-scroll" : ""}`}>Scroll to explore</p>

      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <div className="overlay-container">
          <h1 className="outro__text">Report <strong>Sent</strong></h1>
          <a 
              className="explore"
              href="/"
            >
              Replay
          </a>
        </div>
      </div>

    </div>
  )
}

export default Overlay
