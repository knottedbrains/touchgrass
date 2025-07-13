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
      background: `url(${gardenBg}) center center / cover no-repeat`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <button
        onClick={toggleTheme}
        title="Toggle light/dark mode"
        style={{
          position: 'absolute',
          top: 24,
          right: 32,
          zIndex: 2,
          background: 'none',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: 'var(--color-green)',
          cursor: 'pointer',
        }}
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255,255,255,0.70)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 38, marginBottom: 2 }}>🌱</span>
        </div>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 10, color: 'var(--color-text)' }}>{mode === 'login' ? 'Log in' : 'Sign Up'}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 18, marginBottom: 32 }}>{mode === 'login' ? 'Go touch grass.' : 'Continue touching grass.'}</p>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 18, background: 'none', boxShadow: 'none', border: 'none', padding: 0 }}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="email" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text)',
                fontSize: 16,
                outline: 'none',
              }}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="password" style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text)',
                fontSize: 16,
                outline: 'none',
              }}
            />
          </div>
          <button type="submit" style={{
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 18,
            marginTop: 8,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'background 0.2s',
          }}>
            {mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <div style={{ marginTop: 24, color: 'var(--color-text-muted)', fontSize: 15 }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" style={{ color: 'var(--color-accent)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 15 }} onClick={() => setMode('register')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" style={{ color: 'var(--color-accent)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 15 }} onClick={() => setMode('login')}>
                Login
              </button>
            </>
          )}
        </div>
        <div className="login-footer" style={{ marginTop: 32, color: 'var(--color-text-muted)', fontSize: 14 }}>
          Demo: Use any email and password to login
        </div>
      </div>
    </div>
  )
}

export default LoginPage 