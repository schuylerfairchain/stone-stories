import { useBox } from "@react-three/cannon";
import {  useEffect,  useState } from "react";
import { useItemStore } from "./item-store";
import { Grab } from "./lib/react-xr-default-hands/Grab";
import { stoneMetadata, StoneModel } from "./stones/StoneModel";
import { useStoneUpload } from "./stones/stone-upload";

const CUBE_MASS = 1;

export function Boulder({itemId, ...props}) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore(store => store.items[itemId]);

  const [isGrabbing, setIsGrabbing] = useState(false);

  const [ref, api] = useBox(() => {
    const options: any = {
      args: stoneMetadata[item.model].physicsBox,
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

  const model = <StoneModel ref={ref} type={item.model} virtual={!item.touched && item.id.startsWith('_')}/>;

  return !item.frozen ? 
    <Grab physicsApi={api} onChange={({isGrabbed}) => {
    setIsGrabbing(isGrabbed);
  }}>
    {model}
  </Grab> : model;
}