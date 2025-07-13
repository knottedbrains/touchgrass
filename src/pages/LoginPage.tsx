import React from 'react'
import { useState } from 'react'

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')

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
    <div className="login-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <h1 style={{ fontWeight: 800, fontSize: 36, marginBottom: 10, color: 'var(--color-text)' }}>{mode === 'login' ? 'Welcome Back' : 'Sign Up'}</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 18, marginBottom: 32 }}>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
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
  )
}

export default LoginPage 