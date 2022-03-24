import { Box, Plane } from '@react-three/drei';
import { VRCanvas } from '@react-three/xr';

import './App.css';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { Grabbable } from './lib/react-xr-default-hands/Grabbable';

function Floor() {
  return <Plane args={[5,5]} rotation={[-Math.PI/2, 0, 0]} position={[0, -1, 0]}>
    <meshBasicMaterial color="gray" />
    </Plane>;
}

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <VRCanvas id="vr">
          <DefaultHandControllers />
          
          <Floor />
          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight name="main-point-light" intensity={1.5} position={[-5, -2, -2]} />

          <Grabbable position={[0,2,-0.25]}>
              <Box args={[0.2, 0.2, 0.2]} name="cube">
                <meshStandardMaterial attach="material" color='red' />
              </Box>
          </Grabbable>
        </VRCanvas>
      </main>
    </div>
  );
}

export default App;
