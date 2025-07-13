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

const ProjectPage: React.FC = () => {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const [project] = useState(() => {
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    return allProjects.find((p: any) => String(p.id) === String(projectId)) || null
  })

  // Start with one agent by default
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Agent 1' }
  ])
  const [selectedAgent, setSelectedAgent] = useState('1')
  const [showGrid, setShowGrid] = useState(true)

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
        <div>Project ID: {projectId}</div>
        <button onClick={() => navigate('/dashboard')} className="logout-button" style={{ marginTop: 24 }}>← Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="project-workspace" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <main className="workspace-main" style={{ paddingBottom: 80, paddingTop: 24, paddingLeft: 40, paddingRight: 40 }}>
        <div className="agents-grid" style={{
          display: 'grid',
          gridTemplateColumns: agents.length > 1 ? '1fr 1fr' : '1fr',
          gridTemplateRows: agents.length > 2 ? '1fr 1fr' : '1fr',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {agents.map(agent => (
            <div
              key={agent.id}
              className="agent-preview-card"
              style={{
                background: 'var(--color-card)',
                borderRadius: 12,
                boxShadow: 'var(--color-shadow)',
                padding: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1.5px solid var(--color-accent-light)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 260,
                transition: 'box-shadow 0.2s, border 0.2s',
              }}
              onClick={() => navigate(`/project/${projectId}/agent/${agent.id}`)}
              tabIndex={0}
              role="button"
            >
              <div style={{
                padding: '4px 12px',
                borderBottom: '1px solid var(--color-border)',
                fontWeight: 600,
                color: 'var(--color-accent)',
                fontSize: 13,
                minHeight: 0,
                lineHeight: 1.2,
                background: 'var(--color-card)',
              }}>
                {agent.name}
              </div>
              <div style={{ flex: 1, minHeight: 180, background: 'var(--color-bg)' }}>
                <iframe
                  src={getReadmeUrl(project.repoUrl)}
                  title={`Preview for ${agent.name}`}
                  style={{ width: '100%', height: '100%', border: 'none', background: 'var(--color-card)', pointerEvents: 'none' }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
      <nav className="agent-bar" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--color-bg-alt)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        height: 48,
        zIndex: 50,
        boxShadow: 'none',
      }}>
        <button
          className="agent-tab add-agent"
          onClick={addAgent}
          style={{
            background: 'none',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 0,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
            position: 'absolute',
            left: 16,
          }}
          title="Add agent"
        >
          <Plus size={28} strokeWidth={2.2} color="var(--color-accent)" />
        </button>
        <button
          className="agent-tab home-btn"
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 0,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
          }}
          title="Go to dashboard"
        >
          <House size={28} strokeWidth={2.2} color="var(--color-accent)" />
        </button>
        <button
          className="agent-tab done-btn"
          onClick={() => navigate(`/project/${projectId}/agent/${selectedAgent}`)}
          style={{
            background: 'none',
            color: 'var(--color-accent)',
            border: 'none',
            borderRadius: 0,
            width: 56,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'color 0.2s',
            padding: 0,
            outline: 'none',
            position: 'absolute',
            right: 16,
          }}
          title="Done"
        >
          Done
        </button>
      </nav>
    </div>
  )
}

export default ProjectPage 