import React from 'react'
import { useState } from 'react'
import gardenBg from '../assets/garden-bg.jpg'
import { useTheme } from '../App'

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (mode === 'login') {
      const success = onLogin(email, password)
      if (!success) {
        setError('Invalid credentials')
      }
    } else {
      // Registration logic placeholder
      setError('Registration is not implemented in demo')
    }
  }

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a211a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 38, marginBottom: 2 }}>🌱</span>
        </div>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 10, color: '#fff', fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif' }}>{mode === 'login' ? 'Log in' : 'Sign Up'}</h1>
        <p style={{ color: '#fff', fontSize: 18, marginBottom: 32, fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif' }}>{mode === 'login' ? 'Continue touching grass.' : 'Come touch grass.'}</p>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 18, background: 'none', boxShadow: 'none', border: 'none', padding: 0 }}>
          {error && <div className="error-message" style={{ color: '#fff', background: 'rgba(255,0,0,0.15)', fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif' }}>{error}</div>}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="email" style={{ fontWeight: 600, color: '#fff', marginBottom: 2, fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif' }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="nude-input"
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: 'none',
                boxShadow: 'none',
                background: '#E7DCC9',
                color: '#8C7C63',
                fontSize: 16,
                outline: 'none',
                transition: 'background 0.2s',
                fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif',
              }}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="password" style={{ fontWeight: 600, color: '#fff', marginBottom: 2, fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif' }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="nude-input"
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: 'none',
                boxShadow: 'none',
                background: '#E7DCC9',
                color: '#8C7C63',
                fontSize: 16,
                outline: 'none',
                transition: 'background 0.2s',
                fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif',
              }}
            />
          </div>
          <button type="submit" style={{
            background: '#E7DCC9',
            color: '#8C7C63',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 8,
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 18,
            marginTop: 8,
            cursor: 'pointer',
            transition: 'background 0.2s',
            fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, sans-serif',
          }}>
            {mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <div style={{ marginTop: 24, color: '#fff', fontSize: 16, fontWeight: 500 }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" style={{ color: '#6ea16e', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: 16 }} onClick={() => setMode('register')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" style={{ color: '#6ea16e', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontSize: 16 }} onClick={() => setMode('login')}>
                Login
              </button>
            </>
          )}
        </div>
        <div className="login-footer" style={{ marginTop: 32, color: '#fff', fontSize: 15, fontWeight: 500 }}>
          Demo: Use any email and password to login
        </div>
      </div>
    </div>
  )
}

export default LoginPage 