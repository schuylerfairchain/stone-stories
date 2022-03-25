import { Api, PublicApi } from '@react-three/cannon'
import { Body } from 'cannon-es'
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
    id: string;
    api: PublicApi;
    // position: Vector3;
    // quaternion: Quaternion;
    // body: Body;
}

export type State = {
  itemIds: string[];
  items: Record<string, ItemState>;
  set: (fn: (state: State) => void | State) => void
}

export const useItemStore = createStore<State>(
  immer((set, get, api) => {
    return {
      itemIds: ['1'],
      items: {} as Record<string, ItemState>,
      set: (fn: (state: State) => State | void) => {
        set(fn)
      }
    }
  })
)
