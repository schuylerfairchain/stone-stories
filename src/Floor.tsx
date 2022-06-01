import { usePlane } from '@react-three/cannon';
import { Plane } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';

useGLTF.preload(process.env.PUBLIC_URL + '/models/CirclePlane.gltf');

export function Floor({ invisible, ...props }) {
  const [ref] = usePlane(() => ({ ...props, type: 'Static' }));

  return (
    <Plane ref={ref} args={[10, 10]} receiveShadow>
      {invisible ? <shadowMaterial /> : <meshPhongMaterial color="gray" />}
    </Plane>
  );
}
