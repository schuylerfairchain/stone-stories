import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useState } from "react";
import { Object3D } from "three";
import { useItemStore } from "./item-store";
import { Grab } from "./lib/react-xr-default-hands/Grab";

const CUBE_SIZE = 0.3;
const CUBE_MASS = 1;

const boulderMetadata = {
  'rock-big': {
    path: '/models/rock-big.gltf',
    objectName: 'Object123',
    materialName: 'skatter_rock_01 [imported]'
  },
  'rock-black': {
    path: '/models/rock-black.glb',
    objectName: 'Object074',
    materialName: 'skatter_gravel_01'
  },
  'rock-gray': {
    path: '/models/rock-gray.gltf',
    objectName: 'Object065',
    materialName: 'skatter_gravel_01'
  },
  'rock-irregular': {
    path: '/models/rock-irregular.gltf',
    objectName: 'Object034',
    materialName: 'skatter_gravel_01'
  },
}

useGLTF.preload(assetUrl(boulderMetadata['rock-big'].path));
useGLTF.preload(assetUrl(boulderMetadata['rock-black'].path));
useGLTF.preload(assetUrl(boulderMetadata['rock-gray'].path));
useGLTF.preload(assetUrl(boulderMetadata['rock-irregular'].path));

function assetUrl(path) {
  return process.env.PUBLIC_URL + path;
}

const BoulderModel = forwardRef<Object3D, {type: string} & any>(({type, ...rest}, ref) => {
  const metadata = boulderMetadata[type];
  const {nodes, materials} = useGLTF(assetUrl(metadata.path));

  return     <mesh ref={ref} {...rest} castShadows geometry={(nodes[metadata.objectName] as any).geometry} material={materials[metadata.materialName]}/>;
});

export function Boulder({itemId, ...props}) {
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
        api.allowSleep.set(false);
        api.wakeUp();
      } else{
        api.mass.set(CUBE_MASS);
        api.allowSleep.set(true);
      }
    }
  }, [isGrabbing, api, item.frozen])
  

  return <Grab physicsApi={api} disabled={item.frozen} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
  }}>
    <BoulderModel ref={ref} type={item.model}/>
  </Grab>;
}