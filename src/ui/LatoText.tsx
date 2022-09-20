import { extend, Object3DNode } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import lato from '../fonts/Lato_Regular.json';
import { FunctionComponent } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
    }
  }
}

interface ILatoTextProps {
  textToDisplay: string;
}

export const LatoText: FunctionComponent<ILatoTextProps> = ({ textToDisplay }) => {
  extend({ TextGeometry });
  const font = new FontLoader().parse(lato);

  return (
    <mesh position={[-1, 0, 0]}>
      <textGeometry args={[textToDisplay, { font, size: 0.2, height: 0.2 }]} />
      <meshBasicMaterial attach="material" color={'white'} />
    </mesh>
  );
};
