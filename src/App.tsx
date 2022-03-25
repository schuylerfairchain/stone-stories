import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Plane, useGLTF } from "@react-three/drei";
import { VRCanvas } from "@react-three/xr";
import { Suspense, useState } from "react";
import "./App.css";
import { DefaultHandControllers } from "./lib/react-xr-default-hands/DefaultHandControllers";
import { Grabbable } from "./Grabbable";

function Floor({ ...props }) {
  const [ref] = usePlane(() => ({ ...props }));

  return (
    <Plane ref={ref} args={[10, 10]}>
      <meshBasicMaterial color="gray" />
    </Plane>
  );
}

function RokGrab() {
  const { nodes, materials } = useGLTF(
    process.env.PUBLIC_URL + "/newPiles.gltf"
  );
  return (
    <mesh
      //@ts-ignore
      geometry={nodes.Object123.geometry}
      material={materials["skatter_rock_01 [imported]"]}
    />
  );
}

function RokPhysics({ position }) {
  const { nodes, materials } = useGLTF(
    process.env.PUBLIC_URL + "/newPiles.gltf"
  );
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: position,
  }));
  return (
    <mesh
      ref={ref}
      //@ts-ignore
      geometry={nodes.Object123.geometry}
      material={materials["skatter_rock_01 [imported]"]}
    />
  );
}

function RokPile() {
  const { nodes, materials } = useGLTF(
    process.env.PUBLIC_URL + "/Piles-big.gltf"
  );
  let nodeMeshes = [];
  for (const node in nodes) {
    //@ts-ignore
    nodeMeshes.push(<mesh key={node} geometry={nodes[node].geometry} material={materials["skatter_gravel_01"]} />);
  }
  return <group position={[0,-1,0]}>
    {nodeMeshes.map((nodeMesh) => nodeMesh)}
  </group>;
}

function World() {
  const [isGrabbed, setGrabbed] = useState(false);
  const [hasGrabbed, setHasGrabbed] = useState(false);

  const initialPosition = [0, 1, -0.25];
  const [position, setPosition] = useState(initialPosition);

  return (
    <Physics>
      <Floor rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} />
      <RokPile />

      {isGrabbed || !hasGrabbed ? (
        <Grabbable
          setHasGrabbed={setHasGrabbed}
          setGrabbed={setGrabbed}
          position={position}
          setPosition={setPosition}
        >
          <RokGrab />
        </Grabbable>
      ) : (
        <RokPhysics position={position} />
      )}
    </Physics>
  );
}
function App() {
  return (
    <Suspense fallback={<div>loading models...</div>}>
      <div className="App">
        <main className="App-body">
          <VRCanvas id="vr">
            <DefaultHandControllers />
            <ambientLight name="main-ambient-light" intensity={0.3} />
            <pointLight
              name="main-point-light"
              intensity={1.5}
              position={[-5, -2, -2]}
            />

            <World />
          </VRCanvas>
        </main>
      </div>
    </Suspense>
  );
}

useGLTF.preload(process.env.PUBLIC_URL + "/newPiles.gltf");
useGLTF.preload(process.env.PUBLIC_URL + "/Piles-big.gltf");

export default App;
