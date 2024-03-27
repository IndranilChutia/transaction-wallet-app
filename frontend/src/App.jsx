import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from '@/pages/Dashboard';
import Protected from './lib/Protected';
const Signup = React.lazy(() => import('@/pages/Signup'))
const Signin = React.lazy(() => import('@/pages/Signin'))
const SendMoney = React.lazy(() => import('@/pages/SendMoney'))

function App() {

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/send" element={<Protected><SendMoney /></Protected>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
