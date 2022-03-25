import { usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";

export function Floor({...props}) {
    const [ref] = usePlane(() => ({ ...props }));
  
    return <Plane ref={ref} args={[10,10]} receiveShadow>
      <meshPhongMaterial color="gray" />
      </Plane>;
  }