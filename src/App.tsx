import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Box, Plane } from '@react-three/drei';
import { VRCanvas } from '@react-three/xr';

import './App.css';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { Grabbable } from './Grabbable';
import { Floor } from './Floor';
import { useItemStore } from './item-store';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, Quaternion, Vector3 } from 'three';
import { Grab } from './lib/react-xr-default-hands/Grab';


function TestCube(itemId, ...props) {
  const set = useItemStore((store) => store.set); 
  // const item = useItemStore(store => store.items[itemId]);
  // const body = item?.body;

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [ref, api] = useBox(() => ({mass: 1, args: [0.2, 0.2, 0.2], type: 'Dynamic'}));

  useEffect(() => {
    if(!api) return;

    set(store => {
      store.items[itemId] ??= {id: itemId, api: undefined};
      store.items[itemId].api = api;
    })
  }, [api, itemId, set]);


  useEffect(() => {
    if(isGrabbing) {
      api.mass.set(0);
    } else {
      api.mass.set(1);
    }
  })

  // const ref = useRef<Object3D>();

  // useFrame(() => {
  //   if(!body || !ref.current) return;

  //   const pos = body.position;
  //   const rot = body.quaternion;
  //   ref.current.position.copy(new Vector3(pos.x, pos.y, pos.z));
  //   ref.current.quaternion.copy(new Quaternion(rot.x, rot.y, rot.z, rot.w));
  // })
  
  return <Grab physicsApi={api} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
    console.log(isGrabbed);
  }}>
    <Box ref={ref} castShadow args={[0.2, 0.2, 0.2]} name="cube" {...props}>
    <meshPhongMaterial color='red'/>
  </Box>
  </Grab>;
}

function World() {
  const itemIds = useItemStore(store => store.itemIds);
  return (
    <Physics>
      <Floor rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

      {
        itemIds.map(itemId => <TestCube itemId={itemId} />)
      }
      {/* <Grabbable position={[0,2,-0.25]}> */}
        {/* <TestCube position={[0, 2, 0]} /> */}
      {/* </Grabbable> */}
    </Physics>
  );
}
function App() {
  return (
    <div className="App">
      <main className="App-body">
        <VRCanvas id="vr" shadows>
          <DefaultHandControllers />
          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight name="main-point-light" intensity={1.5} position={[0, 3, -2]} castShadow/>
          
          <World />
        </VRCanvas>
      </main>
    </div>
  );
}

export default App;
