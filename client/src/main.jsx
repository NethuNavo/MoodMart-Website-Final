import React from 'react'
import { createRoot } from 'react-dom/client'
import Router from './router'
import './style.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
