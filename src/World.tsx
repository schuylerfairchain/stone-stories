import { Physics } from "@react-three/cannon";
import { Suspense, useEffect } from "react";
import { Floor } from "./Floor";
import { ItemState, useItemStore } from "./item-store";
import { Boulder } from "./Boulder";
import { getStones } from "./firebase";

function useInitStones() {
  const set = useItemStore(store => store.set);

  useEffect(() => {
    if(!set) return;
    async function load() {
      const items = await getStones();
      for(const item of items) {
        set(store => {
          const current = store.items[item.id];
          store.items[item.id] = Object.assign({}, current ?? {}, item, 
            {frozen: (current?.frozen ?? true) && item.frozen } // only apply frozen for external items
            );
        });
      }
    }
    load();
  }, [set]);
}

const NEW_STONE_HEIGHT = 1.2;

function useInitNewStones() {
  const set = useItemStore(store => store.set);

  useEffect(() => {
    if(!set) return;
    const newBoulders: ItemState[] = [
      {
        id: '_1',
        model: 'rock-irregular',
        position: [-0.5, NEW_STONE_HEIGHT, -1],
        quaternion: [0, 0, 0, 1],
        levitating: true,
        frozen: false
      },
      {
        id: '_2',
        model: 'rock-big',
        position: [-1, NEW_STONE_HEIGHT, -1],
        quaternion: [0, 0, 0, 1],
        levitating: true,
        frozen: false
      },
      {
        id: '_3',
        model: 'rock-gray',
        position: [0.2, NEW_STONE_HEIGHT, -1],
        quaternion: [0, 0, 0, 1],
        levitating: true,
        frozen: false
      },
      {
        id: '_4',
        model: 'rock-black',
        position: [1, NEW_STONE_HEIGHT, -1],
        quaternion: [0, 0, 0, 1],
        levitating: true,
        frozen: false
      },
    ];

    newBoulders.forEach(item => {
      set(store => {
        store.items[item.id] = item;
      });
    });
  }, [set]);
}

export function World({
  type
}) {
  useInitStones();
  useInitNewStones();
  
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