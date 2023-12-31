/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.5 public/models/solar.gltf
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import Detection from './Detection'
import SolarDetection from './SolarDetection'


//material={materials.SolarCell}

export function Solar(props) {
  const { nodes, materials } = useGLTF('/models/solar.gltf')
  return (
    <group {...props} dispose={null} position-y={2.03} scale={0.75} rotation-y={Math.PI /4}>
      <SolarDetection
        position={[-1, 0.6, -0.4]}
        textPosition={[1.2, 0.8, 0.5]}
        text="DAMAGED CELL"
      />
      <group position={[0.18, -0.292, -0.004]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh geometry={nodes.Cube.geometry} >
          <meshStandardMaterial color={'#555588'} metalness={0.1} roughness={0.3} />
        </mesh>
        <mesh  geometry={nodes.Cube_1.geometry} material={materials['Material.001']} />
        <mesh castShadow={true}  geometry={nodes.Cube_2.geometry} material={materials.Aluminium} />
      </group>
      <mesh  geometry={nodes.Cube005.geometry} material={materials.Aluminium} position={[0, -0.288, 0]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}

useGLTF.preload('/models/solar.gltf')
