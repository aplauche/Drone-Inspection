import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";


export default function Snow(){

  const snowTexture = useTexture('/images/snow-transparent.png')

  const count = 20000;

  const pointsLayer1 = useRef()
  const pointsLayer2 = useRef()

  const particlesPosition = useMemo(() => {
    // Create a Float32Array of count*3 length
    // -> we are going to generate the x, y, and z values for 2000 particles
    // -> thus we need 6000 items in this array
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Generate random values for x, y, and z on every loop
      let x = (Math.random() - 0.5) * 100;
      let y = (Math.random() - 0.5) * 30;
      let z = (Math.random() - 0.5) * 300;

      // We add the 3 values to the attribute array for every loop
      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  useFrame((state, delta) => {
    pointsLayer1.current.position.y -= delta * 0.5
    pointsLayer2.current.position.y -= delta * 0.5

    if(pointsLayer1.current.position.y < -30){
      pointsLayer1.current.position.y = 30
    }
    if(pointsLayer2.current.position.y < -30){
      pointsLayer2.current.position.y = 30
    }
  })

  return (
    <>
    <group ref={pointsLayer1}>
    <points position={[0,10,-150]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} transparent={true} color="#fff" alphaMap={snowTexture} sizeAttenuation depthWrite={false} />

      {/* <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      /> */}
    </points>
        <points position={[0,10,-450]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.2} transparent={true} color="#fff" alphaMap={snowTexture} sizeAttenuation depthWrite={false} />
  
        {/* <shaderMaterial
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        /> */}
      </points>
      </group>
    <group ref={pointsLayer2} position-y={30}>
    <points position={[0,10,-150]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} transparent={true} color="#fff" alphaMap={snowTexture} sizeAttenuation depthWrite={false} />

      {/* <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      /> */}
    </points>
        <points position={[0,10,-450]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.2} transparent={true} color="#fff" alphaMap={snowTexture} sizeAttenuation depthWrite={false} />
  
        {/* <shaderMaterial
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        /> */}
      </points>
      </group>
      </>
  )
}