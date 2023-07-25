import { useProgress } from "@react-three/drei"
import { usePlay } from "../contexts/Play"

const Overlay = () => {

  const {progress} = useProgress()

  const {play, setPlay, hasScroll, end} = usePlay()

  return (
    <div className={`overlay ${play && !end ? "overlay--disable" : ""} ${hasScroll ? "overlay--scrolled" : ""}`}>
      <div className={`loader ${progress === 100 ? "loader--disappear": ''}`} />
      {progress === 100 && (
        <div className={`intro ${play ? "intro--disappear" : ""}`}>
          <div className="intro-container">
            <h1 className="logo">
              sUAS Remote Inpection Drone
              {/* <div className="spinner">
                <div className="spinner__image"></div>
              </div> */}
            </h1>
            <p>Monitor and inspect assets remotely in harsh conditions.</p>
            <button 
              className="explore"
              onClick={() => setPlay(true)}
            >Explore Use Cases</button>
          </div>
          <p className="intro__scroll">Scroll to explore</p>

        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <p className="outro__text">Ready to learn more?</p>
        <a 
            className="button"
            href="/"
          >
            Replay
        </a>
      </div>

    </div>
  )
}

export default Overlay
