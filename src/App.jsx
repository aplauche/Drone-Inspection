import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { EffectComposer, Noise } from "@react-three/postprocessing";

function App() {
  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <fog attach="fog" args={["#e8e8ff", 70, 160]} />
      <ScrollControls pages={20} damping={0.3}>

        <Experience />
      </ScrollControls>

      {/* <EffectComposer>
        <Noise opacity={0.125} />
      </EffectComposer> */}
    </Canvas>
  );
}

export default App;
