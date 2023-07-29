import { Text } from "@react-three/drei"
// import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial"

function TextSection({title, subtitle, ...props}) {
  return (
    <group {...props}>
      {!!title && (
        <Text
        color="white"
        anchorX={"left"}
        anchorY="bottom"
        fontSize={0.35}
        maxWidth={2.8}
        lineHeight={1}
        font={"./fonts/Rubik-Bold.ttf"}
      >
        {title}
        <meshBasicMaterial
          color={"black"}
          //onBeforeCompile={fadeOnBeforeCompileFlat}
        />
      </Text>
      )}

    <Text
      color="white"
      anchorX={"left"}
      anchorY="top"
      position-y={-0.2}
      fontSize={0.15}
      maxWidth={2.4}
      font={"./fonts/Inter-Regular.ttf"}
    >
      {subtitle}
      <meshBasicMaterial
          color={"black"}
          //onBeforeCompile={fadeOnBeforeCompileFlat}
        />
    </Text>
  </group>
  )
}

export default TextSection
