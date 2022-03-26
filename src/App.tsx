import { Physics, useBox, usePlane } from "@react-three/cannon";
import { Plane, useGLTF } from "@react-three/drei";
import { VRCanvas } from "@react-three/xr";
import { Suspense, useEffect, useState } from "react";
import "./App.css";
import { DefaultHandControllers } from "./lib/react-xr-default-hands/DefaultHandControllers";
import { Grabbable } from "./Grabbable";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVuU77lr4SMGtLdpJy2YW9gyHwyEO5f2Y",
  authDomain: "reality-hack.firebaseapp.com",
  projectId: "reality-hack",
  storageBucket: "reality-hack.appspot.com",
  messagingSenderId: "781486086310",
  appId: "1:781486086310:web:a44c7c775f5cc8ed89fc67",
};

// Initialize Firebase
let app;
let db;

const bootstrap = async () => {
  app = initializeApp(firebaseConfig);

  db = getFirestore(app);
};

bootstrap();

const addStone = async (stoneData) => {
  const docRef = await addDoc(collection(db, "stones"), stoneData);
  console.log("Stone deposited with ID: ", docRef.id);
};

const getStones = async () => {
  const querySnapshot = await getDocs(collection(db, "stones"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
  return true;
};

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
    nodeMeshes.push(
      <mesh
        key={node}
        //@ts-ignore
        geometry={nodes[node].geometry}
        material={materials["skatter_gravel_01"]}
      />
    );
  }
  return (
    <group position={[0, -1, 0]}>
      {nodeMeshes.map((nodeMesh) => nodeMesh)}
    </group>
  );
}

function World() {
  const [isGrabbed, setGrabbed] = useState(false);
  const [hasGrabbed, setHasGrabbed] = useState(false);

  const initialPosition = [0, 1, -0.25];
  const [position, setPosition] = useState(initialPosition);

  const stones = getStones();

  useEffect(() => {
    addStone({ position: "hello again" });
    console.log("should be updated");
  }, [hasGrabbed]);

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
useGLTF.preload(process.env.PUBLIC_URL + "/rock-irregular.gltf");
useGLTF.preload(process.env.PUBLIC_URL + "/rock-gray.gltf");
useGLTF.preload(process.env.PUBLIC_URL + "/rock-black.gltf");

export default App;
