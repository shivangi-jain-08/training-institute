import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'
import MemberList from './components/Members/MemberList'
import AddMember from './components/Members/AddMember'
import Layout from './components/Layout/Layout'
import Loading from './components/Common/Loading'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <ThemeProvider>
        <Loading />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          {!user ? (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<MemberList />} />
                <Route path="/members/add" element={<AddMember />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App