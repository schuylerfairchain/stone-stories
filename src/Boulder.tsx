import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Object3D } from "three";
import { useItemStore } from "./item-store";
import { Grab } from "./lib/react-xr-default-hands/Grab";
import { useStoneUpload } from "./stones/stone-upload";

const CUBE_MASS = 1;


interface BoulderMetadata {
  path: string;
  objectName: string;
  materialName: string;
  physicsBox: [number, number, number]
}

const boulderMetadata: Record<string, BoulderMetadata> = {
  'rock-big': {
    path: '/models/rock-big.gltf',
    objectName: 'Object123',
    materialName: 'skatter_rock_01 [imported]',
    physicsBox: [0.3, 0.3, 0.3]
  },
  'rock-black': {
    path: '/models/rock-black.glb',
    objectName: 'Object074',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3]
  },
  'rock-gray': {
    path: '/models/rock-gray.gltf',
    objectName: 'Object065',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3]
  },
  'rock-irregular': {
    path: '/models/rock-irregular.gltf',
    objectName: 'Object034',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3]
  },
}

useGLTF.preload(assetUrl(boulderMetadata['rock-big'].path));
useGLTF.preload(assetUrl(boulderMetadata['rock-black'].path));
useGLTF.preload(assetUrl(boulderMetadata['rock-gray'].path));
useGLTF.preload(assetUrl(boulderMetadata['rock-irregular'].path));

function assetUrl(path) {
  return process.env.PUBLIC_URL + path;
}


function useBoulderModel({path, materialName, objectName}: BoulderMetadata) {
  const {nodes,materials}= useGLTF(assetUrl(path)) as any;

  return useMemo(() => ({object: (nodes[objectName] as any), material: materials[materialName].clone()}), [nodes, objectName, materials, materialName]);
}

const BoulderModel = forwardRef<Object3D, {type: string; virtual: boolean} & any>(({type, virtual=false, ...rest}, ref) => {
  const metadata = boulderMetadata[type];
  const {object, material} = useBoulderModel(metadata);

  return <mesh ref={ref} {...rest} castShadow={!virtual} geometry={object.geometry} material={material} 
  material-transparent={virtual} material-opacity={virtual ? 0.3: 1}
  />;
});


export function Boulder({itemId, ...props}) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore(store => store.items[itemId]);

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [ref, api] = useBox(() => {
    const options: any = {
      args: boulderMetadata[item.model].physicsBox,
      position: item.position,
      quaternion: item.quaternion,
    };
    
    if(!item.frozen && !item.levitating) {
      options.mass = CUBE_MASS;
      options.sleepSpeedLimit = 0.5;
    }
    
    return options;
  }, null, [item.frozen, item.levitating]);

  useEffect(() => {
    if(!api) return;

    set(store => {
      store.items[itemId].api = api;
    })
  }, [api, itemId, set]);

  useEffect(() => {
    return api?.position.subscribe((position) => {
      set(store => {
        if(store.items[itemId]) {
        store.items[itemId].position = position
        }
      });
    });
  }, [api, itemId, set])

  useEffect(() => {
    return  api?.quaternion.subscribe((quaternion) => {
      set(store => {
        if(store.items[itemId]) {

        store.items[itemId].quaternion = quaternion
        }
      });
    })
  }, [api, itemId, set])

  useEffect(() => {
    if(!item.frozen) {
      if(isGrabbing) {
        api.mass.set(0);
        api.allowSleep.set(false);
        api.wakeUp();

        if(item.levitating) {
          set(store => {
            store.items[itemId].touched = true;
          });
        }
      } else{
        if(item.levitating && item.touched) {
          api.mass.set(CUBE_MASS);
          api.allowSleep.set(false);
          api.wakeUp();
          set(store => {
            store.items[itemId].levitating = false;
          })
        }
        if(!item.levitating) {
          api.mass.set(CUBE_MASS);
        }
        api.allowSleep.set(true);
      }
    }
  }, [isGrabbing, api, item.frozen, item.levitating, set, itemId, item.touched, item]);
  
  useStoneUpload(item, api, set);

  const model = <BoulderModel ref={ref} type={item.model} virtual={!item.touched && item.id.startsWith('_')}/>;

  return !item.frozen ? 
    <Grab physicsApi={api} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
  }}>
    {model}
  </Grab> : model;
}