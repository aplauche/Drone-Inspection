import { Text } from "@react-three/drei"
// import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial"

function TextSection({title, subtitle, ...props}) {
  return (
    <group {...props}>
      {!!title && (
        <Text
        color="black"
        anchorX={"left"}
        anchorY="bottom"
        fontSize={0.52}
        maxWidth={3.5}
        lineHeight={1}
        font={"./fonts/DMSerifDisplay-Regular.ttf"}
      >
        {title}
        <meshBasicMaterial
          color={"black"}
          //onBeforeCompile={fadeOnBeforeCompileFlat}
        />
      </Text>
      )}

    <Text
      color="black"
      anchorX={"left"}
      anchorY="top"
      position-y={-0.2}
      fontSize={0.22}
      maxWidth={3.5}
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
