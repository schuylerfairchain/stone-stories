import { Physics } from "@react-three/cannon";
import { Suspense } from "react";
import { Floor } from "./Floor";
import { useItemStore } from "./item-store";
import { TestCube } from "./TestCube";

export function World({
  type
}) {
  const itemIds = useItemStore(store => store.itemIds);
  return (
    <Physics allowSleep>
      <Floor invisible={type === 'ar'} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} />

<Suspense fallback={null}>
      {
        itemIds.map(itemId => <TestCube key={itemId} itemId={itemId} />)
      }
  </Suspense>
    </Physics>
  );
}