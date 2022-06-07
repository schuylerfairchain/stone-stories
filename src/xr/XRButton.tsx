import { useCallback } from 'react';

export function XRButton({ gl, configurations, onConfiguration, buttonContent }) {
  const initXR = useCallback(async () => {
    let nav: any = navigator;

    if ('xr' in nav) {
      let session: any;

      for (const config of configurations) {
        const type = config.sessionType;
        if (await nav.xr.isSessionSupported(type)) {
          session = await nav.xr.requestSession(type, config.sessionInit);

          gl.xr.setReferenceSpaceType(config.referenceSpace);

          if (session) {
            onConfiguration(config);
            break;
          }
        }
      }

      if (session) {
        await gl.xr.setSession(session);
      }
    }
  }, [configurations, gl.xr, onConfiguration]);

  return (
    <button
      style={{
        position: 'absolute',
        bottom: 20,
        left: 'calc(50% - 75px)',
        width: 150,
        height: '2em',
        fontSize: '1em',
        zIndex: 1000,
      }}
      onClick={() => {
        initXR();
      }}
    >
      {buttonContent}
    </button>
  );
}
