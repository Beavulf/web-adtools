import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'antd/dist/reset.css'
import App from './App.jsx'
import { ConfigProvider, theme } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import ruRU from 'antd/es/locale/ru_RU'
import client from './services/apolloClient.js'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <ConfigProvider locale={ruRU} theme={{algorithm: theme.defaultAlgorithm}} componentSize='large'>
            <App />
          </ConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  // </StrictMode>,
)
