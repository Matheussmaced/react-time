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
      return {
        ...state,
        cycle: [...state.cycle, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return {
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
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
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
  }
}
