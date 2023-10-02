import { produce } from 'immer'

import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmout: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleState {
  cycle: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CycleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      /* return {
        ...state,
        cycle: [...state.cycle, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      } */
      return produce(state, (draft) => {
        draft.cycle.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      /* return {
        ...state,
        cycle: state.cycle.map((cycles) => {
          if (cycles.id === state.activeCycleId) {
            return { ...cycles, interruptedDate: new Date() }
          } else {
            return cycles
          }
        }),
        activeCycleId: null, // seta o timer no zero quando interrompido
      }
      */

      const currentCycleIndex = state.cycle.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycle[currentCycleIndex].interruptedDate = new Date()
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      /* return {
        ...state,
        cycle: state.cycle.map((cycles) => {
          if (cycles.id === state.activeCycleId) {
            return { ...cycles, finishedDate: new Date() }
          } else {
            return cycles
          }
        }),
        activeCycleId: null, // seta o timer no zero quando interrompido
      }
    default:
      return state
  } */
      const currentCycleIndex = state.cycle.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycle[currentCycleIndex].finishedDate = new Date()
      })
    }
  }
}
