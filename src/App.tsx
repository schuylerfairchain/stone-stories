import { useState } from 'react';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { World } from './World';
import { XRCanvas } from './xr/XRCanvas';

import './App.css';

const configurations = [
  {
    sessionType: 'immersive-ar',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor',
  },
  {
    sessionType: 'immersive-vr',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor',
  },
];

function App() {
  const [configurationChosen, setConfigurationChosen] = useState(null);

  return (
    <div className="App">
      <main className="App-body">
        <XRCanvas
          shadows
          onConfiguration={setConfigurationChosen}
          configurations={configurations}
          buttonContent="Immerse yourself"
        >
          {configurationChosen && (
            <>
              <DefaultHandControllers />
              <ambientLight name="main-ambient-light" intensity={0.3} />
              <pointLight
                name="main-point-light"
                intensity={1.5}
                position={[0, 3, -2]}
                castShadow
              />

              <World type={configurationChosen.sessionType === 'immersive-vr' ? 'vr' : 'ar'} />
            </>
          )}
        </XRCanvas>
      </main>
    </div>
  );
}

export default App;
