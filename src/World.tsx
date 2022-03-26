import { Physics } from "@react-three/cannon";
import { Suspense } from "react";
import { Floor } from "./Floor";
import { useItemStore } from "./item-store";
import { Boulder } from "./Boulder";

export function World({
  type
}) {
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