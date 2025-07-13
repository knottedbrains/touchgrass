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
      <form
        className="agent-chat-box"
        onSubmit={handleSend}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 56, // height of nav bar
          background: theme === 'dark' ? '#23272f' : '#f3f4f6',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          zIndex: 20,
          boxShadow: 'none',
          height: 44,
          borderRadius: 16,
          width: '92vw',
          maxWidth: 600,
          margin: '0 auto',
          transform: 'translateX(0)',
          color: theme === 'dark' ? '#fff' : '#23272f',
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Chat with your agent"
          style={{
            flex: 1,
            border: 'none', // absolutely no border
            borderRadius: 0, // no border radius for input itself
            padding: '10px 0',
            fontSize: 17,
            background: 'transparent',
            color: theme === 'dark' ? '#fff' : '#23272f',
            outline: 'none',
            boxShadow: 'none',
            minWidth: 0,
            fontWeight: 500,
            letterSpacing: 0.1,
          }}
          autoFocus
          inputMode="text"
        />
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            color: theme === 'dark' ? '#fff' : '#23272f',
            opacity: 1,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'background 0.2s',
            fontSize: 22,
            outline: 'none',
            alignSelf: 'flex-end',
          }}
          aria-label="Send voice message"
        >
          <Mic size={22} color={theme === 'dark' ? '#fff' : '#23272f'} />
        </button>
      </form>
      {/* Terminal Bottom Sheet Modal */}
      {showTerminal && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: '52vh',
            background: theme === 'dark' ? '#181c1f' : '#fff',
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
            <span style={{ fontWeight: 700, fontSize: 18 }}>Code Editor</span>
            <button
              onClick={() => setShowTerminal(false)}
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: 'none',
                marginLeft: 12,
              }}
            >Done</button>
          </div>
          <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', fontFamily: 'monospace', fontSize: 15, background: theme === 'dark' ? 'rgba(0,0,0,0.10)' : '#f3f4f6', borderRadius: 12, margin: 20 }}>
            {/* Placeholder for code changes */}
            Code Editor - See agent changes here
          </div>
        </div>
      )}
      <nav className="agent-bar" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--color-bg-alt)',
        borderTop: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        height: 56,
        zIndex: 30,
        boxShadow: 'none',
      }}>
        <button
          className="agent-tab terminal-toggle"
          style={{
            background: 'none',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 0,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
          }}
          title="Terminal"
        >
          <SquareTerminal size={24} strokeWidth={1.6} color="var(--color-accent)" />
        </button>
        <button
          className="agent-tab bring-to-front"
          style={{
            background: 'none',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 0,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
          }}
          title="Back to project workspace"
          onClick={() => navigate(`/project/${projectId}`)}
        >
          <BringToFront size={24} strokeWidth={1.6} color="var(--color-accent)" />
        </button>
      </nav>
    </div>
  )
}

export default AgentPage 