import { useEffect, useRef } from "react";
import { addStone, updateStone } from "../firebase";
import { PersistentItemState } from "../item-store";

export async function uploadStone(item, set) {
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
  
  function isStatic([x, y, z]) {
    return (isNaN(x) && isNaN(y) && isNaN(z)) ||
    (x === 0 && y === 0 && z === 0);
  }

  export function useStoneUpload(item, api, set) {
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
  
              uploadStone(item, set);
              isDirty.current = false;
            }
          }
  
            previousStatic.current = isStaticTest;
          }
      })
    }, [api, item, set]);
  }