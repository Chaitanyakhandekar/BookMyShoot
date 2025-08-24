import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/public/Home'
import AuthPages from './pages/auth/Login'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import BrowsePhotographers from './pages/public/BrowsePhotographers'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/*" element={<AuthPages />} />
      <Route path="/photographers" element={<BrowsePhotographers />} />
    </Routes>
  )
}

export default App
