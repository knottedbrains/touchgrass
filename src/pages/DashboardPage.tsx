import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { LogOut, Trash, FolderOpen } from 'lucide-react'

interface DashboardPageProps {
  onLogout: () => void
}

interface Project {
  id: string
  repoUrl: string
  name: string
}

const extractRepoName = (url: string) => {
  try {
    const match = url.match(/github\.com\/(.+\/[^\/]+)(?:\.git)?/)
    return match ? match[1] : url
  } catch {
    return url
  }
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [repoUrl, setRepoUrl] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem('projects')
    if (stored) setProjects(JSON.parse(stored))
  }, [])
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL.')
      return
    }
    if (!repoUrl.includes('github.com')) {
      setError('Please enter a valid GitHub URL.')
      return
    }
    const name = extractRepoName(repoUrl)
    setProjects([
      ...projects,
      { id: Date.now().toString(), repoUrl, name }
    ])
    setRepoUrl('')
  }

  const handleProjectClick = (id: string) => {
    navigate(`/project/${id}`)
  }

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(projects.filter(project => project.id !== id))
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <button
            className="circle-icon-btn"
            onClick={toggleTheme}
            title="Toggle light/dark mode"
            style={{ position: 'absolute', left: 0 }}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            🌱touchgrass
          </h1>
          <button
            className="circle-icon-btn"
            onClick={onLogout}
            title="Logout"
            style={{ position: 'absolute', right: 0 }}
          >
            <LogOut size={18} color="var(--color-accent)" />
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-content">
          {projects.length === 0 ? (
            <div className="empty-state" style={{
              maxWidth: 420,
              margin: '80px auto 0 auto',
              textAlign: 'center',
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              padding: 0
            }}>
              <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 10 }}>Welcome</h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 18, marginBottom: 8 }}>You have no projects yet.</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 28 }}>Please import your project from GitHub so that the agents can start working on it.</div>
              <form className="repo-form" onSubmit={handleAddProject}>
                <input
                  type="url"
                  className="repo-input"
                  placeholder="https://github.com/username/repo"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  required
                  style={{ border: '1.5px solid #d1d5db', background: 'var(--color-input-bg)', color: 'var(--color-text)' }}
                />
                <button type="submit" className="repo-add-btn">Open Project</button>
              </form>
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <>
              <div className="projects-list-header">
                <h2>Your Projects</h2>
                <form className="repo-form-inline" onSubmit={handleAddProject}>
                  <input
                    type="url"
                    className="repo-input"
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    required
                  />
                  <button type="submit" className="repo-add-btn">Open Project</button>
                </form>
              </div>
              <div className="projects-grid">
                {projects.map(project => (
                  <div
                    className="project-card clickable"
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    tabIndex={0}
                    role="button"
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div className="project-info">
                      <div className="project-icon"><FolderOpen size={28} color="var(--color-accent)" /></div>
                      <div>
                        <div className="project-name">{project.name.replace(/^[^/]+\//, '').replace(/\.git$/, '')}</div>
                        <a className="project-link" href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                          {project.repoUrl}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        opacity: 0.6,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.color = 'var(--color-accent)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.6'
                        e.currentTarget.style.color = 'var(--color-text-muted)'
                      }}
                      title="Delete project"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage 