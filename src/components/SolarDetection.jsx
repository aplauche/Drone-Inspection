import { Text } from "@react-three/drei"
import { useLayoutEffect, useRef } from "react";
import { gsap } from 'gsap'
import { useFrame } from "@react-three/fiber";
import { usePlay } from "../contexts/Play";

function SolarDetection({ position, textPosition, text}) {


  const detectTL = useRef()

  const error = useRef()
  const errorText = useRef()

  const {solarDetect} = usePlay()


  useLayoutEffect(() => {

    detectTL.current = gsap.timeline()
    detectTL.current.pause()
    detectTL.current.from(error.current.scale, {
      duration: 0.75,
      y: 0,
      x: 0,
      z: 0,
    }).from(errorText.current.material, {
      duration: 0.5,
      opacity: 0
    }, ">-=0.5")




  }, []);

  useFrame((state, delta) => {
    if(solarDetect){
      detectTL.current.play()
    }
  })

  return (
    <group position={position}>
      <mesh ref={error}  scale={[0.6, 0.6, 0.6]} >
        <sphereGeometry />
        <meshBasicMaterial color={"#dd0000"} transparent={true} opacity={0.25}/>
      </mesh>
      <Text
        ref={errorText}
        anchorX={"center"}
        anchorY="top"
        position={textPosition}
        fontSize={0.2}
        maxWidth={2.4}
        font={"./fonts/Rubik-Bold.ttf"}
      >
        {text}
        <meshBasicMaterial color={"#dd6666"} transparent={true} opacity={0.75}/>
      </Text>
    </group>
  )
}

export default SolarDetection
