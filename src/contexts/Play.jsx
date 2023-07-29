import { createContext, useContext, useState } from "react";

const Context = createContext();

export const PlayProvider = ({ children }) => {
  const [play, setPlay] = useState(false);
  const [end, setEnd] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [turbineDetect, setTurbineDetect] = useState(false)
  const [solarDetect, setSolarDetect] = useState(false)
  const [gasDetect, setGasDetect] = useState(false)

  return (
    <Context.Provider
      value={{
        play,
        setPlay,
        end,
        setEnd,
        hasScroll,
        setHasScroll,
        turbineDetect,
        setTurbineDetect,
        solarDetect,
        setSolarDetect,
        gasDetect,
        setGasDetect
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const usePlay = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("usePlay must be used within a PlayProvider");
  }

  return context;
};