import { usePlane } from "@react-three/cannon";
import { Plane } from "@react-three/drei";

export function Floor({invisible, ...props}) {
    const [ref] = usePlane(() => ({ ...props }));
  
    return <Plane ref={ref} args={[10,10]} receiveShadow>
      {
        invisible ?
        <shadowMaterial /> :
      <meshPhongMaterial color="gray" />
      }
      </Plane>;
  }