import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Object3D } from "three";
import { addStone, updateStone } from "./firebase";
import { PersistentItemState, useItemStore } from "./item-store";
import { Grab } from "./lib/react-xr-default-hands/Grab";

const CUBE_MASS = 1;

const boulderMetadata = {
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

const BoulderModel = forwardRef<Object3D, {type: string} & any>(({type, ...rest}, ref) => {
  const metadata = boulderMetadata[type];
  const {nodes, materials} = useGLTF(assetUrl(metadata.path));

  return <mesh ref={ref} {...rest} castShadow geometry={(nodes[metadata.objectName] as any).geometry} material={materials[metadata.materialName]}/>;
});

function isStatic([x, y, z]) {
  return (isNaN(x) && isNaN(y) && isNaN(z)) ||
  (x === 0 && y === 0 && z === 0);
}

async function uploadBoulder(item, set) {
  console.log('Uploading boulder', item);
  const stoneData: PersistentItemState = {
    position: item.position,
    quaternion: item.quaternion,
    model: item.model,
    frozen: true
  };
  if(item.id.startsWith('_')) {
    const id = await addStone(stoneData);

    if(id) {
      set(store => {
        store.items[id] = {
          ...item,
          id
        };
        delete store.items[item.id];
      });
    }
  } else {
    stoneData.id = item.id;
    await updateStone(stoneData);
  }
}

function useBoulderUpload(item, api, set) {
  const isDirty = useRef<boolean>();
  const previousStatic = useRef<boolean>(true);
  
  useEffect(() => {
    if(!api || !set) return;
    return api.velocity.subscribe(velocity => {
      const isStaticTest = isStatic(velocity);
      if(item.touched) {
        if(!isStaticTest) {
          if(previousStatic.current) {
            isDirty.current = true;
          }
        } else {
          if(isDirty.current) {
            console.log(`Uploading ${item.id}`);

            uploadBoulder(item, set);
            isDirty.current = false;
          }
        }

          previousStatic.current = isStaticTest;
        }
    })
  }, [api, item, set]);
}

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
  
  useBoulderUpload(item, api, set);

  const model = <BoulderModel ref={ref} type={item.model}/>;

  return !item.frozen ? 
    <Grab physicsApi={api} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
  }}>
    {model}
  </Grab> : model;
}