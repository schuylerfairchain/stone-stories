import { PublicApi } from '@react-three/cannon'
import produce, { setAutoFreeze } from 'immer'
import createStore, { State as ZustandState, StateCreator } from 'zustand'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const immer =
  <T extends ZustandState>(config: StateCreator<T, (fn: (state: T) => void) => void>): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce(fn) as (state: T) => T), get, api)

setAutoFreeze(false)

export interface ItemState {
    id?: string;
    api?: PublicApi;
    position: [number, number, number];
    quaternion: [number, number, number, number];
    frozen: boolean;
    model: string;
}

export type State = {
  items: Record<string, ItemState>;
  set: (fn: (state: State) => void | State) => void
}

export const useItemStore = createStore<State>(
  immer((set, get, api) => {
    return {
      items: {
        /*a: {
          position: [0, 0.9, -0.3],
          quaternion: [0, 0, 0, 1],
          frozen: false,
          model: 'rock-big'
        },
        b: {
          position: [0, 0.5, -0.5],
          quaternion: [0, 0, 0, 1],
          frozen: false,
          model: 'rock-gray'
        },c: {
          position: [0, 1, -0.5],
          quaternion: [0, 0, 0, 1],
          frozen: false,
          model: 'rock-black'
        },d: {
          position: [0.2, 2, -0.5],
          quaternion: [0, 0, 0, 1],
          frozen: false,
          model: 'rock-irregular'
        }*/
      } as Record<string, ItemState>,
      set: (fn: (state: State) => State | void) => {
        set(fn)
      }
    }
  })
)
