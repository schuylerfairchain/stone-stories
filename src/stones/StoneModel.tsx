import { useGLTF } from '@react-three/drei';
import { forwardRef, useMemo } from 'react';
import { Object3D } from 'three';

interface StoneMetadata {
  path: string;
  objectName: string;
  materialName: string;
  physicsBox: [number, number, number];
}

export const stoneMetadata: Record<string, StoneMetadata> = {
  'rock-big': {
    path: '/models/rock-big.gltf',
    objectName: 'Object123',
    materialName: 'skatter_rock_01 [imported]',
    physicsBox: [0.3, 0.25, 0.3],
  },
  'rock-black': {
    path: '/models/rock-black.glb',
    objectName: 'Object074',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3],
  },
  'rock-gray': {
    path: '/models/rock-gray.gltf',
    objectName: 'Object065',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3],
  },
  'rock-irregular': {
    path: '/models/rock-irregular.gltf',
    objectName: 'Object034',
    materialName: 'skatter_gravel_01',
    physicsBox: [0.3, 0.3, 0.3],
  },
};

useGLTF.preload(assetUrl(stoneMetadata['rock-big'].path));
useGLTF.preload(assetUrl(stoneMetadata['rock-black'].path));
useGLTF.preload(assetUrl(stoneMetadata['rock-gray'].path));
useGLTF.preload(assetUrl(stoneMetadata['rock-irregular'].path));

function assetUrl(path) {
  return process.env.PUBLIC_URL + path;
}

export function useStoneModel({ path, materialName, objectName }: StoneMetadata) {
  const { nodes, materials } = useGLTF(assetUrl(path)) as any;

  return useMemo(
    () => ({ object: nodes[objectName] as any, material: materials[materialName].clone() }),
    [nodes, objectName, materials, materialName],
  );
}

export const StoneModel = forwardRef<Object3D, { type: string; virtual: boolean } & any>(
  ({ type, virtual = false, ...rest }, ref) => {
    const metadata = stoneMetadata[type];
    const { object, material } = useStoneModel(metadata);

    return (
      <mesh
        ref={ref}
        {...rest}
        castShadow={!virtual}
        geometry={object.geometry}
        material={material}
        material-transparent={virtual}
        material-opacity={virtual ? 0.3 : 1}
      />
    );
  },
);
