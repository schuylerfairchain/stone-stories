import {Canvas, useThree} from '@react-three/fiber';
import { XR, InteractionManager, useXR } from '@react-three/xr';
import { useCallback, useEffect, useState } from 'react';

import './App.css';
import { DefaultHandControllers } from './lib/react-xr-default-hands/DefaultHandControllers';
import { World } from './World';

const configurations = [
  {
    sessionType: 'immersive-ar',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor'
  },
  {
    sessionType: 'immersive-vr',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor'
  }
]

function XRButton({gl, onConfiguration}) {
  const initXR = useCallback(async () => {
    let nav: any = navigator;

    if('xr' in nav) {
      let session: any;

      for(const config of configurations){
        const type = config.sessionType;
        if(await nav.xr.isSessionSupported(type)) {
          session = await nav.xr.requestSession(type, config.sessionInit);

          gl.xr.setReferenceSpaceType(config.referenceSpace);

          if(session) {
            onConfiguration(config);
            break;
          };
        }
      }

      if(session) {
        await gl.xr.setSession(session);
      }
    }
  }, [gl]);

  return <button style={{
    position: 'absolute',
    bottom: 20,
    left: 'calc(50% - 75px)',
    width: 150,
    height: '2em',
    fontSize: '1em',
    zIndex: 1000
  }} onClick={() => {initXR()}}>
    Immerse yourself
  </button>
}

function XRWatch({onGl, onIsPresenting}) {
  const gl = useThree(state => state.gl);
  const {isPresenting} = useXR();

  useEffect(() => {
    onIsPresenting?.(isPresenting);
  }, [isPresenting, onIsPresenting]);

  useEffect(() => {
    onGl?.(gl);
  }, [gl, onGl]);

  return null;
}

function XRCanvas({children, onConfiguration, ...rest}) {
  const [gl, setGl] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);

  return (
    <>
      <Canvas id="vr" vr {...rest}>
      <XR>
        <InteractionManager>
          <XRWatch onGl={setGl} onIsPresenting={setIsPresenting} />          
          {children}
        </InteractionManager>
      </XR>
      </Canvas>
      {!isPresenting && <XRButton gl={gl} onConfiguration={onConfiguration}/>}
    </>
  );
}

function App() {

  const [configurationChosen, setConfigurationChosen] = useState(null);

  return (
    <div className="App">
      <main className="App-body">
        <XRCanvas shadows onConfiguration={setConfigurationChosen}>
          {
            configurationChosen && <>
            <DefaultHandControllers />
          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight name="main-point-light" intensity={1.5} position={[0, 3, -2]} castShadow/>

          
          <World type={configurationChosen.sessionType === 'immersive-vr' ? 'vr' : 'ar'}/>
            </>
          }
          
        </XRCanvas>
      </main>
    </div>
  );
}

export default App;
