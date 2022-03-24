import { Box } from '@react-three/drei';
import { Hands, VRCanvas } from '@react-three/xr';

import { Rotating } from './Rotating';
import './App.css';

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <VRCanvas id="vr">
          <Hands />

          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight name="main-point-light" intensity={1.5} position={[-5, -2, -2]} />
          <group position={[0,1,-5]} scale={[0.2, 0.2, 0.2]}>
            <Rotating>
                <Box name="cube" scale={[2,2,2]}>
                  <meshStandardMaterial attach="material" color='red' />
                </Box>
            </Rotating>
          </group>
        </VRCanvas>
      </main>
    </div>
  );
}

export default App;
