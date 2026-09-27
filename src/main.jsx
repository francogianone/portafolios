import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ProjectDetails from './components/ProjectDetails.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { initSmoothScroll } from './lib/smoothScroll.js'
import './index.css'

initSmoothScroll()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        
        <Route path="/project/:id" element={<ProjectDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)