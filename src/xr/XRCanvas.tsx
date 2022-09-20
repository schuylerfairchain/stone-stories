import { Canvas, useThree } from '@react-three/fiber';
import { InteractionManager, useXR, XR } from '@react-three/xr';
import { useEffect, useState } from 'react';
import { LatoText } from '../ui/LatoText';
import { XRButton } from './XRButton';

function XRWatch({ onGl, onIsPresenting }) {
  const gl = useThree((state) => state.gl);
  const { isPresenting } = useXR();

  useEffect(() => {
    onIsPresenting?.(isPresenting);
  }, [isPresenting, onIsPresenting]);

  useEffect(() => {
    onGl?.(gl);
  }, [gl, onGl]);

  return null;
}

export function XRCanvas({ children, configurations, onConfiguration, buttonContent, ...rest }) {
  const [gl, setGl] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);

  return (
    <>
      <Canvas id="vr" vr {...rest}>
        {!isPresenting && (
          <>
            <LatoText textToDisplay="STONE STORIES" />
          </>
        )}
        <XR>
          <InteractionManager>
            <XRWatch onGl={setGl} onIsPresenting={setIsPresenting} />
            {children}
          </InteractionManager>
        </XR>
      </Canvas>

      {!isPresenting && gl && (
        <>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              position: 'absolute',
              top: 0,
              zIndex: -15,
            }}
          ></div>
          <XRButton
            gl={gl}
            configurations={configurations}
            onConfiguration={onConfiguration}
            buttonContent={buttonContent}
          />
        </>
      )}
    </>
  );
}
