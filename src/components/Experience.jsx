import { Cloud, ContactShadows, Float, OrbitControls, PerspectiveCamera, Sky, SoftShadows, useHelper, useScroll } from "@react-three/drei";
import { useMemo, useRef, useEffect, useLayoutEffect } from "react";
import Background from "./Background";
import { Barn } from "./Barn";
import { Solar } from "./Solar";
import { Tree } from "./Tree";
import { Turbine } from "./Turbine";
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";
import TextSection from "./TextSection";
// import Grass from "./Grass";
import { CameraHelper } from 'three';
import Snow from "./Snow";
import { OilTank } from "./OilTank";
import { usePlay } from "../contexts/Play";
import gsap from "gsap";
import { Drone } from "./Drone";

const LINE_NB_POINTS = 1000;

const CURVE_DISTANCE = 100;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const PROXIMITY_EFFECT_DISTANCE = 42

export const Experience = () => {

  const camera = useRef()
  const airplane = useRef()
  const cameraGroup = useRef()
  const cameraRail = useRef()

  const shadowCam = useRef()
  const dirLight = useRef()

  const {play, setHasScroll, hasScroll, setEnd} = usePlay()

  const debugMode = false

  //useHelper(shadowCam, CameraHelper, 1, 'hotpink')



  const curvePoints = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(25, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-25, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(25, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
    ]
  }, []) 

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
    curvePoints,
    false,
    "catmullrom",
    0.5)
  })

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);


  // TEXT SECTIONS

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: 1,
        position: new THREE.Vector3(
          curvePoints[2].x - 1.75,
          curvePoints[2].y + 4.5,
          curvePoints[2].z + 4
        ),
        title: "Turbine Inspection",
        subtitle: `Identify critical weak points before failure`,
      },
      {
        cameraRailDist: -1.25,
        position: new THREE.Vector3(
          curvePoints[3].x + 1,
          curvePoints[3].y + 4.5,
          curvePoints[3].z +1
        ),
        title: "Solar Panel Arrays",
        subtitle: `Locate underperforming or damaged cells.`,
      },
      {
        cameraRailDist: -1.25,
        position: new THREE.Vector3(
          curvePoints[4].x - 2.8,
          curvePoints[4].y + 4.5,
          curvePoints[4].z +3
        ),
        title: "Methane Detection",
        subtitle: `Inspect aging infrastructure for comprimised components.`,
      }
    ];
  }, []);



  const scroll = useScroll()
  const lastScroll = useRef(0)

  console.log(scroll)

  useFrame((state, delta) => {

    if (window.innerWidth > window.innerHeight) {
      // LANDSCAPE
      camera.current.fov = 36;
      camera.current.position.z = 10;
    } else {
      // PORTRAIT
      camera.current.fov = 80;
      camera.current.position.z = 7.5;
    }

    // Detect whether use has scrolled
    if(lastScroll.current <= 0 && scroll.offset > 0){
      setHasScroll(true)
    }



    const scrollOffset = Math.max(0, scroll.offset)

    // get the scroll speed to affect drone tilt
    let tilt = (scroll.offset - lastScroll.current) * 10

    tilt = Math.min(tilt, Math.PI / 8)
    tilt = Math.max(tilt, -Math.PI / 8)

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        -tilt,
        airplane.current.rotation.y,
        airplane.current.rotation.z
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

    // varaible to track if we are in a proximity effect zone
    let resetCameraRail = true;
    let friction = 1;

    // check out distance to text sections
    textSections.forEach(textSection => {
      const distance = textSection.position.distanceTo(cameraGroup.current.position)

      if(distance < PROXIMITY_EFFECT_DISTANCE){
        friction = Math.max(distance /  PROXIMITY_EFFECT_DISTANCE, 0.05);
        // slide camera
        const targetCameraRailPosition = new THREE.Vector3((1 - distance / PROXIMITY_EFFECT_DISTANCE) * textSection.cameraRailDist, 0, 0);
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    })

    // if the previuos proximity effect has not run then we lerp back to normal path
    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }


    // CALCULATE LERPED SCROLL OFFSET
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );

  
    // PROTECT BELOW 0 AND ABOVE 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    // update last scroll
    lastScroll.current = lerpedScrollOffset;
    //tl.current.seek(lerpedScrollOffset * tl.current.duration());

    // select the actual point from the index
    const curPoint = curve.getPoint(lerpedScrollOffset);

    // Move the whole group to the point that corresponds with scroll pos 
    cameraGroup.current.position.lerp(curPoint, delta * 15) // default 24

    // get our point to look ahead at ()
    const lookAtPoint = curve.getPoint(Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1));

    // get current look at direction
    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
    .subVectors(curPoint, lookAtPoint) // subtract lookatpoint from current point
    .normalize(); // normalize from 0 - 1

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );


    dirLight.current.position.z = cameraGroup.current.position.z - 40
    dirLight.current.target.position.z = cameraGroup.current.position.z - 45
    dirLight.current.position.x = cameraGroup.current.position.x - 3
    dirLight.current.target.position.x = cameraGroup.current.position.x + 2
    dirLight.current.target.updateMatrixWorld()

    // dirLight.current.target.updateMatrixWorld()

    // Airplane rotation

    // const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);

    // const nonLerpLookAt = new Group();
    // nonLerpLookAt.position.copy(curPoint);
    // nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    // tangent.applyAxisAngle(
    //   new THREE.Vector3(0, 1, 0),
    //   -nonLerpLookAt.rotation.y
    // );

    // let angle = Math.atan2(-tangent.z, tangent.x);
    // angle = -Math.PI / 2 + angle;

    // // convert to degrees to manipulate
    // let angleDegrees = (angle * 180) / Math.PI;
    // angleDegrees *= 2.4; // stronger angle

    // // LIMIT PLANE ANGLE
    // if (angleDegrees < 0) {
    //   angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    // }
    // if (angleDegrees > 0) {
    //   angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    // }

    // // SET angle back to radians
    // angle = (angleDegrees * Math.PI) / 180;

    // const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
    //   new THREE.Euler(
    //     airplane.current.rotation.x,
    //     airplane.current.rotation.y,
    //     angle
    //   )
    // );
    // airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

    if (
      cameraGroup.current.position.z <
      curvePoints[curvePoints.length - 1].z + 100
    ) {
      setEnd(true);
      planeOutTl.current.play();
    }
 
  })


  // ANIMATIONS


  const planeTl = useRef()
  const planeOutTl = useRef();

  useLayoutEffect(() => {

    planeTl.current = gsap.timeline()

    planeTl.current.pause()
    planeTl.current.from(airplane.current.position, {
      duration: 3,
      y: -1
    })


    planeOutTl.current = gsap.timeline();
    planeOutTl.current.pause();

    planeOutTl.current.to(
      airplane.current.position,
      {
        duration: 10,
        y: 20,
      },
      0
    );
    planeOutTl.current.to(
      cameraRail.current.position,
      {
        duration: 8,
        y: 5,
      },
      0
    );

  }, []);

  useEffect(() => {
    if(play){
      planeTl.current.play()
    }
  }, [play])



  return (
    <>
      <directionalLight ref={dirLight} castShadow position={[0, 20, -10]} intensity={0.2} shadow-mapSize={3000}>
        <orthographicCamera ref={shadowCam} attach="shadow-camera" args={[-45, 45, -45, 45, 0.1, 75]} />
      </directionalLight>

      <Snow />

      <ambientLight intensity={0.15} />

      <SoftShadows />


      { !!debugMode && (
        <>
          <OrbitControls />
          <PerspectiveCamera ref={camera} position={[30, 10, 30]} fov={30} makeDefault/>
        </>
      )}


      {/* <Sky distance={45000} sunPosition={[0, 0.5, 0.7]} inclination={0} azimuth={0.25} fog={true}/> */}


      <group ref={cameraGroup}>
        <Background />
        <group ref={cameraRail}>
          {!debugMode && (
            <PerspectiveCamera ref={camera} position={[0, 4, 10]} fov={window.innerWidth > window.innerHeight ? 36 : 80} makeDefault rotation-x={-0.1} />
          )}
        </group>
        <group ref={airplane} position={[0, 3.2, 5]}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Drone scale={0.1} />
          </Float>
        </group>
      </group>





      {/* Ground Plane */}
      <mesh rotation-x={- Math.PI / 2} receiveShadow={true}>
        <meshStandardMaterial  color={"#eee"} />
        <planeGeometry args={[2000, 2000]} />
        {/* <shadowMaterial transparent opacity={0.2} /> */}
      </mesh>

      {/* TREES */}

      {curvePoints.map((point, idx) => (
        <group key={idx} >
          <Tree position={[point.x + 2, 0, point.z - 2]} />
          <Tree position={[point.x - 3, 0, point.z + 6]} />
          <Tree position={[point.x - 5, 0, point.z -8]} />
          <Tree position={[point.x + 7, 0, point.z - 15]} />
          <Tree position={[point.x -6, 0, point.z - 25]} />

          <Tree position={[point.x + 8, 0, point.z - 24]} />
          <Tree position={[point.x - 12, 0, point.z + 20]} />
          <Tree position={[point.x - 15, 0, point.z - 35]} />
          <Tree position={[point.x + 8, 0, point.z - 65]} />
          <Tree position={[point.x -14, 0, point.z - 70]} />

          {/* <Cloud  position-z={point.z-10} position-y={10} position-x={point.x - 6} fog={false} />
          <Cloud  position-z={point.z+20} position-y={10} position-x={point.x + 6} fog={false} /> */}
        </group>
      ))}


      {/* TEXT */}
      {textSections.map((textSection, idx) => (
        <TextSection {...textSection} key={idx} />
      ))}
      


      <group position={[
        curvePoints[2].x + 3, 
        0, 
        curvePoints[2].z
      ]}>
        <Turbine />

      </group>
      <group position={[curvePoints[3].x - 3, 0, curvePoints[3].z - 3]}>
        <Solar />
      </group>
      <group position={[curvePoints[4].x + 4.25, 0, curvePoints[4].z]}>
        <OilTank />
      </group>

      

      {/* LINE */}
      <group position-y={2.8}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={0.75} transparent />
        </mesh>
      </group>
    </>
  );
};
