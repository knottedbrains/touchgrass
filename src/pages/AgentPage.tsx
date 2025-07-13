import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { GalleryVerticalEnd, SquareTerminal, Mic, BringToFront } from 'lucide-react'

interface Agent {
  id: string
  name: string
}

const getReadmeUrl = (repoUrl: string) => {
  if (!repoUrl.includes('github.com')) return repoUrl
  return repoUrl + '#readme'
}

const AgentPage: React.FC = () => {
  const { projectId, agentId } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [showTerminal, setShowTerminal] = useState(false)

  const [project] = useState(() => {
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    return allProjects.find((p: any) => String(p.id) === String(projectId)) || null
  })

  const [agents] = useState<Agent[]>([
    { id: '1', name: 'Agent 1' },
    { id: '2', name: 'Agent 2' },
    { id: '3', name: 'Agent 3' },
    { id: '4', name: 'Agent 4' }
  ])
  const [selectedAgent] = useState(agentId || '1')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string}[]>([])

  if (!project) {
    return (
      <div style={{ color: 'red', padding: 40 }}>
        <h2>Project not found</h2>
        <div>Project ID: {projectId}</div>
        <button onClick={() => navigate(`/project/${projectId}`)} className="logout-button" style={{ marginTop: 24 }}>←</button>
      </div>
    )
  }

  const agent = agents.find(a => a.id === selectedAgent)
  const [showGrid, setShowGrid] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, { sender: 'You', text: chatInput }])
    setChatInput('')
    // Here you would send the message to the AI agent and handle the response
  }

  return (
    <div className="project-workspace" style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src={getReadmeUrl(project.repoUrl)}
        title={`Preview for ${agent?.name}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', border: 'none', background: 'var(--color-card)', zIndex: 1 }}
      />
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 64, zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', pointerEvents: 'auto' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ color: msg.sender === 'You' ? 'var(--color-accent)' : 'var(--color-text-muted)', marginBottom: 8 }}>
              <b>{msg.sender}:</b> {msg.text}
            </div>
          ))}
        </div>
      </div>
      {/* Divider bar above nav bar */}
      <div className="bottom-nav-divider" />
      <nav className="bottom-nav" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, background: 'rgba(26,33,26,0.85)', backdropFilter: 'blur(12px)', border: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <div className="bottom-nav__item" style={{ flex: '0 0 56px', minWidth: 0 }} onClick={() => navigate(`/project/${projectId}`)} tabIndex={0} role="button">
          <BringToFront className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
          <span className="bottom-nav__label">Workspace</span>
        </div>
        <form
          className="agent-chat-box"
          onSubmit={handleSend}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            margin: '0 8px',
            background: 'rgba(231,220,201,0.13)',
            borderRadius: 18,
            padding: '0 14px',
            height: 36,
            minWidth: 0,
            boxShadow: 'none',
            border: 'none',
            fontFamily: 'Cera Pro, sans-serif',
            borderTop: 'none',
            maxWidth: '100%',
          }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Chat with your agent"
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 18,
              padding: '8px 0',
              fontSize: 13,
              background: 'transparent',
              color: '#232e25',
              outline: 'none',
              boxShadow: 'none',
              minWidth: 0,
              fontWeight: 400,
              fontFamily: 'Cera Pro, sans-serif',
            }}
            autoFocus
            inputMode="text"
          />
        </form>
        <div className="bottom-nav__item" style={{ flex: '0 0 56px', minWidth: 0 }} onClick={() => setShowTerminal(true)} tabIndex={0} role="button">
          <SquareTerminal className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
          <span className="bottom-nav__label">Terminal</span>
        </div>
      </nav>
      {/* Terminal Bottom Sheet Modal */}
      {showTerminal && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: '52vh',
            background: '#1a211a',
            color: theme === 'dark' ? '#fff' : '#23272f',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.25s cubic-bezier(.4,1.4,.6,1)',
            border: 'none',
          }}
        >
          <div style={{ padding: '18px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#fff', fontFamily: 'Cera Pro, sans-serif' }}>Code Editor</span>
            <button
              onClick={() => setShowTerminal(false)}
              style={{
                background: '#E7DCC9',
                color: '#232e25',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                fontFamily: 'Cera Pro, sans-serif',
                boxShadow: 'none',
                marginLeft: 12,
                transition: 'background 0.2s',
              }}
            >Done</button>
          </div>
          <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', fontFamily: 'monospace', fontSize: 15, background: 'rgba(36,41,46,0.10)', borderRadius: 12, margin: 20, color: '#fff' }}>
            {/* Placeholder for code changes */}
            Code Editor - See agent changes here
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentPage 