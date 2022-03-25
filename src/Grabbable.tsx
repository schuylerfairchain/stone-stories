import { FC, useRef, useState } from 'react'
import { Object3D } from 'three'

import { Grab } from './lib/react-xr-default-hands/Grab'
import { useStore } from './lib/react-xr-default-hands/store'

export const Grabbable: FC<any> = (props) => {
  const group = useRef<Object3D | undefined>()

  const [moved, setMoved] = useState(false);

  const set = useStore((store) => store.set)

  return (
    <Grab
      onChange={({ isGrabbed, controller }) => {
        if(isGrabbed && !moved) {
          setMoved(true);
        }
        
        if (isGrabbed) {
          set((store) => {
            store.hands.interacting!.current[controller.inputSource.handedness] = group.current
          })
        }
      }}
      ref={group}
      {...props}
      dispose={null} />
  )
}
