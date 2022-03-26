import { Physics } from "@react-three/cannon";
import { Suspense, useEffect } from "react";
import { Floor } from "./Floor";
import { useItemStore } from "./item-store";
import { Boulder } from "./Boulder";
import { getStones } from "./firebase";

function useLoadStones() {
  const set = useItemStore(store => store.set);

  useEffect(() => {
    if(!set) return;
    async function load() {
      const items = await getStones();
      console.log(items);
      set(store => {
        store.items = Object.fromEntries(items.map(item => [item.id, item]));
      })
    }
    load();
  }, [set]);
}

export function World({
  type
}) {
  useLoadStones();
  
  const itemIds = useItemStore(store => Object.keys(store.items));
  return (
    <Physics allowSleep>
      <Floor invisible={type === 'ar'} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

<Suspense fallback={null}>
      {
        itemIds.map(itemId => <Boulder key={itemId} itemId={itemId} />)
      }
  </Suspense>
    </Physics>
  );
}