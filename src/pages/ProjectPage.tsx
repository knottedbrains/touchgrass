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
                color: '#232e25',
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
      {/* Divider bar above nav bar */}
      <div className="bottom-nav-divider" />
      <nav className="bottom-nav">
        <div className="bottom-nav__item" onClick={() => navigate('/dashboard')} tabIndex={0} role="button">
          <House className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
          <span className="bottom-nav__label" style={{ color: '#232e25', fontSize: 9 }}>Dashboard</span>
        </div>
        <div className="bottom-nav__item" tabIndex={0} role="presentation" style={{ pointerEvents: 'none', opacity: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#E7DCC9', fontSize: 16, fontWeight: 700, fontFamily: 'Cera Pro, sans-serif', letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140, display: 'block', marginTop: 2 }}>
            {project?.name ? project.name.replace(/^[^/]+\//, '').replace(/\.git$/, '') : 'Project'}
          </span>
        </div>
        <div className="bottom-nav__item" onClick={addAgent} tabIndex={0} role="button">
          <Plus className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
          <span className="bottom-nav__label" style={{ color: '#232e25', fontSize: 9 }}>Add Agent</span>
        </div>
      </nav>
    </div>
  )
}

export default ProjectPage 