import { createContext, useState, ReactNode, useReducer } from 'react'

interface CreateCycleDate {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmout: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycle: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleDate) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

interface CycleState {
  cycle: Cycle[]
  activeCycleId: string | null
}

export const CyclesContextProvider = ({
  children,
}: CycleContextProviderProps) => {
  const [cycleState, dispatch] = useReducer(
    (state: CycleState, action: any) => {
      if (action.type === 'ADD_NEW_CYCLE') {
        return {
          ...state,
          cycle: [...state.cycle, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        }
      }

      if (action.type === 'INTERRUPT_CURRENT_CYCLE') {
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
      }

      return state
    },
    {
      cycle: [],
      activeCycleId: null,
    },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0) // tanto de segundos já passado apos a inicialização de um newCycle

  const { cycle, activeCycleId } = cycleState

  const activeCycle = cycle.find((cycles) => cycles.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        data: activeCycleId,
      },
    })

    /*  setCycle((state) =>
      state.map((cycles) => {
        if (cycles.id === activeCycleId) {
          return { ...cycles, interruptedDate: new Date() }
        } else {
          return cycles
        }
      }),
    )

    setActiveCycleId(null) */
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })

    /*  setCycle((state) =>
      state.map((cycles) => {
        if (cycles.id === activeCycleId) {
          return { ...cycles, finishedDate: new Date() }
        } else {
          return cycles
        }
      }),
    ) */
  }

  const createNewCycle = (data: CreateCycleDate) => {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmout: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    //        cycle         cycle
    // setCycle((state) => [...state, newCycle])
    setAmountSecondsPassed(0)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycle,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
