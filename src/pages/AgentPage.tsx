import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { Plus, House } from 'lucide-react'

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
          bottom: 48,
          background: 'var(--color-bg-alt)',
          borderTop: '1px solid #ededed',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          zIndex: 20,
          boxShadow: '0 -1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Chat with your agent..."
          style={{
            flex: 1,
            border: '1px solid #ededed',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 15,
            marginRight: 12,
            background: 'var(--color-input-bg)',
            color: 'var(--color-text)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'background 0.2s',
          }}
        >Send</button>
      </form>
      <nav className="agent-bar" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--color-bg-alt)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        zIndex: 30,
        boxShadow: 'none',
      }}>
        <button
          className="agent-tab add-agent"
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
            fontSize: 40,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
          }}
          title="Add agent"
        >
          <Plus size={40} strokeWidth={2.2} color="var(--color-accent)" />
        </button>
        <button
          className="agent-tab home-btn"
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
            fontSize: 40,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
          }}
          title="Go to dashboard"
          onClick={() => navigate('/dashboard')}
        >
          <House size={40} strokeWidth={2.2} color="var(--color-accent)" />
        </button>
        <button
          className="agent-tab done-btn"
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
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
            letterSpacing: '0.5px',
          }}
          title="Done"
        >
          Done
        </button>
      </nav>
    </div>
  )
}

export default AgentPage 