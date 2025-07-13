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
  // Add state for kill confirmation modal
  const [killAgentId, setKillAgentId] = useState<string | null>(null);

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
                  onClick={e => { e.stopPropagation(); setKillAgentId(agent.id); }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'rgba(232,90,90,0.12)',
                    border: '1.5px solid #e85a5a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'background 0.18s, border 0.18s',
                    zIndex: 2,
                    boxShadow: 'none',
                  }}
                  tabIndex={0}
                  aria-label="Remove agent"
                  className="agent-x-btn"
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(232,90,90,0.22)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(232,90,90,0.12)'}
                >
                  <X size={14} color="#e85a5a" strokeWidth={2.2} />
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
                  src={'http://35.239.67.204'}
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
      <nav className="bottom-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="bottom-nav__item" onClick={() => navigate('/dashboard')} tabIndex={0} role="button" style={{ flex: '0 0 56px', minWidth: 0 }}>
          <House className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
          <span className="bottom-nav__label" style={{ color: '#232e25', fontSize: 9 }}>Dashboard</span>
        </div>
        <div className="bottom-nav__item" tabIndex={0} role="presentation" style={{ pointerEvents: 'none', opacity: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ color: '#E7DCC9', fontSize: 16, fontWeight: 700, fontFamily: 'Cera Pro, sans-serif', letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140, display: 'block', marginTop: 2 }}>
            {project?.name ? project.name.replace(/^[^/]+\//, '').replace(/\.git$/, '') : 'Project'}
          </span>
        </div>
        <div className="bottom-nav__item" onClick={addAgent} tabIndex={0} role="button" style={{ flex: '0 0 56px', minWidth: 0 }}>
          <Plus className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
          <span className="bottom-nav__label" style={{ color: '#232e25', fontSize: 9 }}>Add Agent</span>
        </div>
      </nav>
      {/* Kill agent confirmation modal */}
      {killAgentId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(26,33,26,0.75)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
        }}>
          <div style={{ background: '#232e25', borderRadius: 16, padding: '28px 18px', minWidth: 0, maxWidth: 340, width: '100%', boxShadow: '0 4px 32px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 16, fontFamily: 'Cera Pro, sans-serif', textAlign: 'center' }}>Kill Agent?</div>
            <div style={{ color: '#E7DCC9', fontSize: 15, marginBottom: 24, textAlign: 'center', fontFamily: 'Cera Pro, sans-serif' }}>
              Are you sure you want to kill this agent?<br />
              <span style={{ fontSize: 14, color: '#e85a5a' }}>This action cannot be undone.</span>
            </div>
            <div style={{ display: 'flex', gap: 14, width: '100%', justifyContent: 'center' }}>
              <button onClick={() => setKillAgentId(null)} style={{ background: '#cbbfae', color: '#232e25', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, padding: '10px 24px', cursor: 'pointer', fontFamily: 'Cera Pro, sans-serif' }}>Cancel</button>
              <button onClick={() => {
                setAgents(agents.filter(a => a.id !== killAgentId));
                setKillAgentId(null);
              }} style={{ background: '#e85a5a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, padding: '10px 24px', cursor: 'pointer', fontFamily: 'Cera Pro, sans-serif' }}>Kill</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectPage 