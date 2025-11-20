// src/components/Loader.jsx
import React from "react";
import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center style={{ color: "white", fontSize: 14 }}>
      <div style={{
        background: "rgba(0,0,0,0.6)",
        padding: "8px 14px",
        borderRadius: 8
      }}>
        Loading {Math.round(progress)}%
      </div>
    </Html>
  );
}
