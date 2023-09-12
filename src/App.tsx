import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './components/styles/themes/default'
import { GlobalStyle } from './components/styles/global'

import { Router } from './components/Router'
import { BrowserRouter } from 'react-router-dom'
import { CyclesContextProvider } from './contexts/CyclesContext'

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <BrowserRouter>
          <CyclesContextProvider>
            <Router />
          </CyclesContextProvider>
        </BrowserRouter>

        <GlobalStyle />
      </ThemeProvider>
    </>
  )
}

export default App
