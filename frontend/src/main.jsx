import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18next.js' // инициализация i18next
import App from './App.jsx'
import store from './app/store.js'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
}

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </RollbarProvider>
    </ReduxProvider>
  </StrictMode>,
)
