import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Details from './pages/Details'


const App = () => {
  return ( 
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Dashboard />}  />
        <Route path='/dashboard' element={<Dashboard />}  />
        <Route path='/details' element={<Details />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App