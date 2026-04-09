import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SendMoney from './pages/SendMoney'
import History from './pages/History'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',marginTop:'4rem',fontSize:'1.2rem'}}>
      Loading...
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/send" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}