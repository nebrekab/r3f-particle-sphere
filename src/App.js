import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import "./scene.css";

const CustomGeometryParticles = ({ count, shape, particleSize = 0.025 }) => {
  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    // e.g. 3000 xyz coords
    const positions = new Float32Array(count * 3);

    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        let x = (Math.random() - 0.5) * 2;
        let y = (Math.random() - 0.5) * 2;
        let z = (Math.random() - 0.5) * 2;

        positions.set([x, y, z], i * 3);
      }
    }

    if (shape === "sphere") {
      const distance = 1;

      for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        let x = distance * Math.sin(theta) * Math.cos(phi);
        let y = distance * Math.sin(theta) * Math.sin(phi);
        let z = distance * Math.cos(theta);

        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]);

  // load in a png to make the points circular adn not square
  const sprite = new THREE.TextureLoader().load("assets/disc.png");
  sprite.colorSpace = THREE.SRGBColorSpace;

  // colours to set the points to - converts RGB values to 0-1
  const colourValues = [
    [98 / 255, 76 / 255, 239 / 255],
    [255 / 255, 137 / 255, 53 / 255],
    [0 / 255, 204 / 255, 182 / 255]
  ];
  const totalColours = colourValues.length;
  // 3000 rgb 0-1 values
  const particleColours = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    particleColours.set(
      colourValues[Math.floor(Math.random() * totalColours)],
      i * 3
    );
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleColours.length / 3}
          array={particleColours}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        alphaTest={0.25}
        transparent={true}
        map={sprite}
        sizeAttenuation={true}
        depthWrite={true}
        vertexColors={true}
      />
    </points>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [1, 1, 1.5] }} linear flat>
      <ambientLight intensity={0.5} />
      {/* Try to change the shape prop to "box" and hit reload! */}
      <CustomGeometryParticles
        count={1000}
        shape="sphere"
        particleSize={0.045}
      />
      <OrbitControls autoRotate autoRotateSpeed={1.0} enableZoom={false} />
    </Canvas>
  );
};

export default Scene;
