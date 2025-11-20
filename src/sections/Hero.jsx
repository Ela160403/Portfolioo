import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/parallaxBackground";
import Spiderman from "../components/Spiderman";
import { Float, ContactShadows, Environment } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense } from "react";
import Loader from "../components/Loader";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });

  return (
    <section
      id="home"
      className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space"
    >
      <HeroText />
      <ParallaxBackground />

      <figure
        className="absolute inset-0"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 3], fov: 40 }}
        >
          <Suspense fallback={<Loader />}>
            {/* Lights */}
            <ambientLight intensity={0.6} />

            <directionalLight
              castShadow
              intensity={1.1}
              position={[4, 6, 2]}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-bias={-0.0005}
            />

            <directionalLight intensity={0.6} position={[-3, 2, -2]} />

            <spotLight
              castShadow
              intensity={0.9}
              position={[0, 6, 6]}
              angle={0.35}
              penumbra={0.6}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <Environment preset="park" />

            {/* Model */}
            <Float speed={0.3} rotationIntensity={0.4} floatIntensity={0.3}>
             <Spiderman
  scale={isMobile ? 1.2 : 1.1}   // ⬅ Make THIS big
  position={isMobile ? [0, -1.3, 0] : [0.7, -0.82, 0.6]}
        />

            </Float>

            {/* Ground shadow */}
            <ContactShadows
              position={[0, -1.5, 0]}
              scale={1}
              blur={1.5}
              opacity={0.8}
            />

            <Rig />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1.2 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
