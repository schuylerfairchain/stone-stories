import {  useEffect,  useState } from "react";
import { useItemStore } from "./item-store";
import { Grab } from "./lib/react-xr-default-hands/Grab";
import { StoneModel } from "./stones/StoneModel";
import { useStoneUpload } from "./stones/stone-upload";
import { STONE_MASS, useStonePhysics } from "./stones/use-stone-physics";


export function Stone({itemId, ...props}) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore(store => store.items[itemId]);

  const [ref,api] = useStonePhysics(itemId);
  const [isGrabbing, setIsGrabbing] = useState(false);

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
          api.mass.set(STONE_MASS);
          api.allowSleep.set(false);
          api.wakeUp();
          set(store => {
            store.items[itemId].levitating = false;
          })
        }
        if(!item.levitating) {
          api.mass.set(STONE_MASS);
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