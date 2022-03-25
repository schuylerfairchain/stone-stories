import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Box, Plane } from '@react-three/drei';
import { VRCanvas } from '@react-three/xr';

import './App.css';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { Grabbable } from './Grabbable';

function Floor({...props}) {
  const [ref] = usePlane(() => ({ ...props }));

  return <Plane ref={ref} args={[10,10]} receiveShadow>
    <meshPhongMaterial color="gray" />
    </Plane>;
}

function TestCube() {
  return <Box castShadow args={[0.2, 0.2, 0.2]} name="cube">
    <meshPhongMaterial color='red'/>
  </Box>;
}

function World() {

  return (
    <Physics>
        <Floor rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} />

      <Grabbable position={[0,2,-0.25]}>
        <TestCube />
      </Grabbable>
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
