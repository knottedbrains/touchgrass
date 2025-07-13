import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { ArrowLeft } from 'lucide-react'

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, { sender: 'You', text: chatInput }])
    setChatInput('')
    // Here you would send the message to the AI agent and handle the response
  }

  return (
    <div className="project-workspace" style={{ minHeight: '100vh', background: 'var(--color-bg)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <header className="dashboard-header" style={{ flex: '0 0 auto', minHeight: 36, padding: '6px 12px' }}>
        <div className="header-content" style={{ alignItems: 'center', minHeight: 0 }}>
          <button onClick={() => navigate(`/project/${projectId}`)} className="logout-button" style={{ marginRight: 10, width: 32, height: 32, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }} title="Back to grid">
            <ArrowLeft size={18} color="var(--color-accent)" />
          </button>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--color-text-muted)', margin: 0, letterSpacing: '-0.2px', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {project.name} — {agent?.name}
          </span>
        </div>
      </header>
      <main className="workspace-main" style={{ flex: '1 1 0', minHeight: 0, padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <iframe
            src={getReadmeUrl(project.repoUrl)}
            title={`Preview for ${agent?.name}`}
            style={{ width: '100%', height: '100%', border: 'none', background: 'var(--color-card)', flex: 1 }}
          />
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ color: msg.sender === 'You' ? 'var(--color-accent)' : 'var(--color-text-muted)', marginBottom: 8 }}>
              <b>{msg.sender}:</b> {msg.text}
            </div>
          ))}
        </div>
      </main>
      <form
        className="agent-chat-box"
        onSubmit={handleSend}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--color-bg-alt)',
          borderTop: '1.5px solid #ededed',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          zIndex: 100,
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
            border: '1.5px solid #ededed',
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
    </div>
  )
}

export default AgentPage 