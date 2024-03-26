import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from '@/pages/Dashboard';
const Signup = React.lazy(() => import('@/pages/Signup'))
const Signin = React.lazy(() => import('@/pages/Signin'))
const SendMoney = React.lazy(() => import('@/pages/SendMoney'))

function App() {

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
