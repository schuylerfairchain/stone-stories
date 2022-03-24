import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export const Rotating: React.FC<{speed?: number}> = ({
    children,
    speed = 0.1
}) => {
    const group = useRef<Group>();

    useFrame((state, delta) => {
        if(group.current !== undefined){
            group.current.rotation.y += delta * speed;
            group.current.rotation.x += delta * speed;
        }
    })
    return (
        <group ref={group}>
            {children}
        </group>
    )
};
