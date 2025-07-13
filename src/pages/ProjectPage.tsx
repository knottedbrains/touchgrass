import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'

interface Agent {
  id: string
  name: string
}

const getReadmeUrl = (repoUrl: string) => {
  // Try to get the README preview for the repo
  // e.g. https://github.com/user/repo -> https://github.com/user/repo#readme
  if (!repoUrl.includes('github.com')) return repoUrl
  return repoUrl + '#readme'
}

const ProjectPage: React.FC = () => {
  console.log('ProjectPage loaded')
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()

  // For demo, just use localStorage or session for project info
  // In real app, fetch project by id
  const [project] = useState(() => {
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    return allProjects.find((p: any) => String(p.id) === String(id)) || null
  })

  // Agent state
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Agent 1' }
  ])
  const [selectedAgent, setSelectedAgent] = useState('1')

  const addAgent = () => {
    const newId = Date.now().toString()
    setAgents([...agents, { id: newId, name: `Agent ${agents.length + 1}` }])
    setSelectedAgent(newId)
  }
  const closeAgent = (id: string) => {
    if (agents.length === 1) return
    const idx = agents.findIndex(a => a.id === id)
    const newAgents = agents.filter(a => a.id !== id)
    setAgents(newAgents)
    if (selectedAgent === id) {
      setSelectedAgent(newAgents[Math.max(0, idx - 1)].id)
    }
  }

  if (!project) {
    return (
      <div style={{ color: 'red', padding: 40 }}>
        <h2>Project not found</h2>
        <div>Project ID: {id}</div>
        <button onClick={() => navigate('/dashboard')} className="logout-button" style={{ marginTop: 24 }}>← Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="project-workspace" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header className="dashboard-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="logout-button" style={{ marginRight: 16 }}>← Back</button>
          <h1 style={{ flex: 1 }}>{project.name}</h1>
        </div>
      </header>
      <main className="workspace-main" style={{ paddingBottom: 80, paddingTop: 24 }}>
        <div className="workspace-preview" style={{ height: '60vh', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--color-shadow)', background: 'var(--color-card)' }}>
          {project.repoUrl ? (
            <iframe
              src={getReadmeUrl(project.repoUrl)}
              title="Project Preview"
              style={{ width: '100%', height: '100%', border: 'none', background: 'var(--color-card)' }}
            />
          ) : (
            <div style={{ padding: 32, color: 'var(--color-text-muted)' }}>No project found.</div>
          )}
        </div>
        <div className="agent-content" style={{ marginTop: 32, minHeight: 120, background: 'var(--color-card)', borderRadius: 12, boxShadow: 'var(--color-shadow)', padding: 24 }}>
          <h2 style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '1.2rem', marginBottom: 12 }}>{agents.find(a => a.id === selectedAgent)?.name}</h2>
          <div style={{ color: 'var(--color-text-muted)' }}>
            {/* Placeholder for agent-specific content */}
            This is the workspace for <b>{agents.find(a => a.id === selectedAgent)?.name}</b>. Here you can show agent chat, actions, or logs.
          </div>
        </div>
      </main>
      <nav className="agent-bar" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--color-bg-alt)',
        borderTop: '1.5px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        height: 64,
        zIndex: 50,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)'
      }}>
        {agents.map(agent => (
          <div
            key={agent.id}
            className={selectedAgent === agent.id ? 'agent-tab active' : 'agent-tab'}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: selectedAgent === agent.id ? 'var(--color-card)' : 'transparent',
              color: 'var(--color-text)',
              borderRadius: 8,
              marginRight: 8,
              padding: '8px 18px',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: selectedAgent === agent.id ? 'var(--color-shadow)' : 'none',
              border: selectedAgent === agent.id ? '1.5px solid var(--color-primary)' : '1.5px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onClick={() => setSelectedAgent(agent.id)}
          >
            {agent.name}
            {agents.length > 1 && (
              <span
                style={{ marginLeft: 10, color: 'var(--color-error-text)', fontWeight: 700, cursor: 'pointer', fontSize: 18 }}
                onClick={e => { e.stopPropagation(); closeAgent(agent.id) }}
                title="Close agent"
              >×</span>
            )}
          </div>
        ))}
        <button
          className="agent-tab add-agent"
          onClick={addAgent}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 700,
            fontSize: 20,
            marginLeft: 4,
            cursor: 'pointer',
            boxShadow: 'var(--color-shadow)',
            transition: 'background 0.2s',
          }}
          title="Add agent"
        >+
        </button>
      </nav>
    </div>
  )
}

export default ProjectPage 