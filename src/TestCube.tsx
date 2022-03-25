import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useItemStore } from "./item-store";
import { Grab } from "./lib/react-xr-default-hands/Grab";

const CUBE_SIZE = 0.3;
const CUBE_MASS = 1;

export function TestCube({itemId, ...props}) {
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
  
  const {nodes, materials} = useGLTF(process.env.PUBLIC_URL + "/Piles.gltf");

  return <Grab physicsApi={api} disabled={item.frozen} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
  }}>
    
      <mesh ref={ref} name="cube" {...props} castShadow geometry={(nodes.Object123 as any).geometry} material={materials['skatter_rock_01 [imported]']}>
        </mesh>
  </Grab>;
}

useGLTF.preload(process.env.PUBLIC_URL + "/Piles.gltf")