import { VRCanvas } from '@react-three/xr';

import './App.css';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { World } from './World';


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
