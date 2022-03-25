import { FC, useRef, useState } from 'react'
import { Object3D } from 'three'

import { Grab } from './lib/react-xr-default-hands/Grab'

export const Grabbable: FC<any> = (props) => {
  const group = useRef<Object3D | undefined>()

  const [moved, setMoved] = useState(false);

  return (
    <Grab
      onChange={({ isGrabbed, controller }) => {
        if(isGrabbed && !moved) {
          setMoved(true);
        }
      }}
      ref={group}
      {...props}
      dispose={null} />
  )
}
