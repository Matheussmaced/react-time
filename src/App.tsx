import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './components/styles/themes/default'
import { GlobalStyle } from './components/styles/global'

import { Router } from './components/Router'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>

        <GlobalStyle />
      </ThemeProvider>
    </>
  )
}

export default App
