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
          <h1 className="logo">
            Drone Inspection
            {/* <div className="spinner">
              <div className="spinner__image"></div>
            </div> */}
          </h1>
          <p className="intro__scroll">Scroll to explore</p>
          <button 
            className="explore"
            onClick={() => setPlay(true)}
          >Explore Use Cases</button>
        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <p className="outro__text">Wish you had a great flight with us...</p>
      </div>

    </div>
  )
}

export default Overlay
