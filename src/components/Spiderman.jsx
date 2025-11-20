import React, { useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Spiderman({
  position = [1.5, -1.2, 0],
  scale = 0.4,
  rotation = [0, 0, 0],
  ...props
}) {
  const glbPath = "/miles_morales_across_the_spider_verse.glb";

  const group = useRef();
  const { scene, animations } = useGLTF(glbPath);
  const { actions } = useAnimations(animations, group);

  const idle = useRef(0);
  const [hovered, setHovered] = useState(false);

  // enable shadows
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // initial transform
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
      group.current.scale.set(scale, scale, scale);
      group.current.rotation.set(...rotation);
    }
  }, [position, scale, rotation]);

  // auto play first animation
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const first = actions[Object.keys(actions)[0]];
      first.reset().fadeIn(0.5).play();
      first.setLoop(THREE.LoopRepeat);
    }
  }, [actions]);

  useFrame((state, delta) => {
    // camera follow rotation
    const targetX = state.mouse.y * 0.15;
    const targetY = state.mouse.x * 0.6;

    group.current.rotation.x += (targetX - group.current.rotation.x) * 5 * delta;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 5 * delta;

    // breathing effect
    idle.current += delta * 1.4;
    const breathe = 1 + Math.sin(idle.current) * 0.01;

    // hover scale
    const targetScale = (hovered ? scale * 1.06 : scale) * breathe;

    group.current.scale.x += (targetScale - group.current.scale.x) * 6 * delta;
    group.current.scale.y += (targetScale - group.current.scale.y) * 6 * delta;
    group.current.scale.z += (targetScale - group.current.scale.z) * 6 * delta;

    // subtle bobbing
    const bob = Math.sin(idle.current * 0.6) * 0.005;

    group.current.position.x += (position[0] - group.current.position.x) * 6 * delta;
    group.current.position.y += (position[1] + bob - group.current.position.y) * 6 * delta;
    group.current.position.z += (position[2] - group.current.position.z) * 6 * delta;
  });

  return (
    <group
      ref={group}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/miles_morales_across_the_spider_verse.glb");
