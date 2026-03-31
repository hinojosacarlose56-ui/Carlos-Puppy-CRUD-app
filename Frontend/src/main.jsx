import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AsgardeoProvider } from '@asgardeo/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AsgardeoProvider
      clientId="6AhKcr6Hf9_fVZZil2o3QGMP94Ea"
      baseUrl="https://api.asgardeo.io/t/ceh4269"
      signInRedirectURL="https://carlos-puppy-crud-app-1.onrender.com/"
      signOutRedirectURL="https://carlos-puppy-crud-app-1.onrender.com/"
      scopes="openid profile"
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
)
