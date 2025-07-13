import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'

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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content" style={{ position: 'relative' }}>
          <h1>🌱touchgrass</h1>
          <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', right: 0, top: 0, height: '100%' }}>
            <button
              className="circle-icon-btn"
              onClick={onLogout}
              title="Logout"
              style={{ marginRight: 10 }}
            >
              <span role="img" aria-label="logout" style={{ fontSize: 20 }}>🔒</span>
            </button>
            <button
              className="circle-icon-btn"
              onClick={toggleTheme}
              title="Toggle light/dark mode"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-content">
          {projects.length === 0 ? (
            <div className="empty-state">
              <h2>Welcome! You have no projects yet.</h2>
              <p className="empty-desc">Paste a public GitHub repository URL below to open your first project.</p>
              <form className="repo-form" onSubmit={handleAddProject}>
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
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="project-info">
                      <div className="project-icon">📁</div>
                      <div>
                        <div className="project-name">{project.name}</div>
                        <a className="project-link" href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                          {project.repoUrl}
                        </a>
                      </div>
                    </div>
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