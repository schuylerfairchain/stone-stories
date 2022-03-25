import { Physics, useBox } from '@react-three/cannon';
import { Box } from '@react-three/drei';
import { VRCanvas } from '@react-three/xr';

import './App.css';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { Floor } from './Floor';
import { useItemStore } from './item-store';
import { useEffect, useState } from 'react';
import { Grab } from './lib/react-xr-default-hands/Grab';

const CUBE_SIZE = 0.3;
const CUBE_MASS = 1;

function TestCube({itemId, ...props}) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore(store => store.items[itemId]);

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [ref, api] = useBox(() => {
    const options: any = {
      args: [CUBE_SIZE, CUBE_SIZE, CUBE_SIZE], position: item.position, quaternion: item.quaternion,
      type: item.frozen ? 'Kinematic' : 'Dynamic'
    };

    if(!item.frozen) {
      options.mass = CUBE_MASS;
      options.sleepSpeedLimit = 0.2;
    }
    
    return options;
  });

  useEffect(() => {
    if(!api) return;

    set(store => {
      store.items[itemId].api = api;
    })
  }, [api, itemId, set]);

  useEffect(() => {
    return api?.position.subscribe((position) => {
      set(store => {
        store.items[itemId].position = position
      });
    });
  }, [api, itemId, set])

  useEffect(() => {
    return  api?.quaternion.subscribe((quaternion) => {
      set(store => {
        store.items[itemId].quaternion = quaternion
      });
    })
  }, [api, itemId, set])

  useEffect(() => {
    if(!item.frozen) {
      if(isGrabbing) {
        api.mass.set(0);
      } else{
        api.mass.set(CUBE_MASS);
      }
    }
  }, [isGrabbing, api, item.frozen])
  
  return <Grab physicsApi={api} disabled={item.frozen} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
  }}>
    <Box ref={ref} castShadow args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} name="cube" {...props}>
    <meshPhongMaterial color='red'/>
  </Box>
  </Grab>;
}

function World() {
  const itemIds = useItemStore(store => store.itemIds);
  return (
    <Physics allowSleep>
      <Floor rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

      {
        itemIds.map(itemId => <TestCube key={itemId} itemId={itemId} />)
      }
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
