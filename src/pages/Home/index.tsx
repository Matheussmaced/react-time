import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { differenceInSeconds } from 'date-fns' // diferença de duas datas em segundos

import {
  HomeContainer,
  FormContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
  StopCountdownButton,
} from './styles'
import { useEffect, useState } from 'react'

// schema = definir um formato e validar-mos os dados do form com base no formato
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

/* interface NewCycleFormData {
  task: string
  minutesAmount: number
} */

// typeof = converter variavel js para ts
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmout: number
  startDate: Date
  interruptedDate?: Date
}

export const Home = () => {
  const [cycle, setCycle] = useState<Cycle[]>([]) // array de ciclos, por isso o []
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0) // tanto de segundos já passado apos a inicialização de um newCycle

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycle.find((cycles) => cycles.id === activeCycleId)

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = window.setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }
    // return no useEffect serve para quando alterarmos novamente a variavel, que aconteça algo com o useEffect que está executando
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle]) // time

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmout: data.minutesAmount,
      startDate: new Date(),
    }

    //        cycle         cycle
    setCycle((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset() // funciona quando difinimons o task com string vazia no useForm
  }

  function handleInterruptCycle() {
    setCycle(
      cycle.map((cycles) => {
        if (cycles.id === activeCycleId) {
          return { ...cycles, interruptedDate: new Date() }
        } else {
          return cycles
        }
      }),
    )

    setActiveCycleId(null)
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmout * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0') // preeche uma string até um tamanho especifico com algum caracter/ se n tiver 2 caracteres, adiciono um '0' no inico
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds])

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <>
      <HomeContainer>
        <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
          <FormContainer>
            <label htmlFor="task">Vou trabalhar em</label>
            <TaskInput
              type="text"
              id="task"
              placeholder="Dê um nome para o seu projeto"
              list="task-suggestions"
              {...register('task')}
              disabled={!!activeCycle}
            />
            <datalist id="task-suggestions">
              <option value="Projeto 1" />
              <option value="Projeto 2" />
              <option value="Projeto 3" />
            </datalist>

            <label htmlFor="minutesAmount">Durante</label>
            <MinutesAmountInput
              type="number"
              id="minutesAmount"
              placeholder="00"
              step={5}
              min={5}
              max={60}
              {...register('minutesAmount', { valueAsNumber: true })}
              disabled={!!activeCycle}
            />

            <span>Minutos.</span>
          </FormContainer>
          <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
          </CountdownContainer>

          {activeCycle ? (
            <StopCountdownButton type="button" onClick={handleInterruptCycle}>
              <HandPalm size={24} />
              Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
              <Play size={24} />
              Começar
            </StartCountdownButton>
          )}
        </form>
      </HomeContainer>
    </>
  )
}
