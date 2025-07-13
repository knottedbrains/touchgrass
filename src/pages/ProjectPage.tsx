import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { Plus, House, X } from 'lucide-react'

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
        {agents.length === 0 && (
          <div style={{ color: '#E7DCC9', fontSize: 18, textAlign: 'center', margin: '40px 0 24px 0', fontFamily: 'Cera Pro, sans-serif', fontWeight: 500 }}>
            There are currently no agents running.<br />Please import a project to get started.
          </div>
        )}
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
                position: 'relative',
              }}
              onClick={() => navigate(`/project/${projectId}/agent/${agent.id}`)}
              tabIndex={0}
              role="button"
            >
              {/* X button top right */}
              {agents.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); closeAgent(agent.id); }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(231,220,201,0.98)',
                    border: '1.5px solid #cbbfae',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px 0 rgba(36,41,46,0.10)',
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'background 0.18s, box-shadow 0.18s',
                    zIndex: 2,
                  }}
                  tabIndex={0}
                  aria-label="Remove agent"
                  className="agent-x-btn"
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(203,191,174,0.98)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(231,220,201,0.98)'}
                >
                  <X size={20} color="#232e25" strokeWidth={2.2} />
                </button>
              )}
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