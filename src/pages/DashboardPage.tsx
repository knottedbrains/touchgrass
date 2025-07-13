import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { LogOut, Trash, FolderOpen, Flower2, CircleUserRound } from 'lucide-react'
import gardenBg from '../assets/garden-bg.jpg'

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
  const [activeTab, setActiveTab] = useState<'projects' | 'agents' | 'account'>('projects')
  const [lastProjectId, setLastProjectId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem('projects')
    if (stored) setProjects(JSON.parse(stored))
    const lastId = localStorage.getItem('lastProjectId')
    if (lastId) setLastProjectId(lastId)
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
    localStorage.setItem('lastProjectId', id)
    setLastProjectId(id)
    navigate(`/project/${id}`)
  }

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(projects.filter(project => project.id !== id))
    }
  }

  return (
    <div className="dashboard-container" style={{
      minHeight: '100vh',
      minWidth: '100vw',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header className="dashboard-header" style={{
          background: 'rgba(26,33,26,0.85)',
          borderBottom: '1px solid rgba(231,220,201,0.5)',
          boxShadow: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 10,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h1 className="touchgrass-logo" style={{ margin: 0, fontWeight: 700, fontSize: 17, letterSpacing: '0.04em', color: '#fff', fontFamily: 'Cera Pro, sans-serif', textTransform: 'lowercase' }}>
            🌱touchgrass
          </h1>
        </header>
        {/* Floating logout button (bottom right) */}
        <button
          className="circle-icon-btn"
          onClick={onLogout}
          title="Logout"
          style={{
            position: 'fixed',
            right: 18,
            bottom: 18,
            zIndex: 100,
            background: 'var(--color-bg-alt)',
            border: '1.5px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: 'var(--color-accent)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <LogOut size={18} color="var(--color-accent)" />
        </button>
        <main className="dashboard-main">
          <div className="dashboard-content">
            {activeTab === 'projects' && (
              projects.length === 0 ? (
                <div style={{
                  maxWidth: 420,
                  margin: '80px auto 0 auto',
                  textAlign: 'center',
                  padding: 0
                }}>
                  <h2 style={{
                    fontWeight: 600, // was 700
                    fontSize: 40,
                    margin: '48px 0 12px 0',
                    textAlign: 'center',
                    letterSpacing: '-0.01em',
                    color: '#fff',
                  }}>
                    Welcome
                  </h2>
                  <div style={{ color: '#E7DCC9', fontSize: 15, marginBottom: 28 }}>
                    you have no projects yet. 
                    import your github project & continue building from your phone
                  </div>
                  <form className="repo-form" onSubmit={handleAddProject}>
                    <input
                      type="url"
                      className="repo-input"
                      placeholder="https://github.com/username/repo"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      required
                      style={{ border: '1.5px solid #d1d5db', background: 'var(--color-input-bg)', color: 'var(--color-text)', fontFamily: 'Cera Pro, sans-serif' }}
                    />
                    <button type="submit" className="repo-add-btn" style={{ color: '#23272f' }}>Clone</button>
                  </form>
                  {error && <div className="error-message">{error}</div>}
                </div>
              ) : (
                <>
                  <div style={{ marginTop: 56 }} />
                  <form className="repo-form-inline" onSubmit={handleAddProject}>
                    <input
                      type="url"
                      className="repo-input"
                      placeholder="https://github.com/username/repo"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      required
                      style={{ fontFamily: 'Cera Pro, sans-serif' }}
                    />
                    <button type="submit" className="repo-add-btn">Clone</button>
                  </form>
                  <style>{`.repo-add-btn { color: #23272f !important; }`}</style>
                  <h2 style={{ margin: '18px 0 6px 0', fontWeight: 700, fontSize: 22, textAlign: 'left' }}>Your Projects</h2>
                  <div className="projects-grid" style={{ marginTop: 0 }}>
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
                          <Trash size={16} color="#000" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}
            {activeTab === 'account' && (
              <div style={{ maxWidth: 420, margin: '80px auto 0 auto', textAlign: 'center', padding: 0 }}>
                <h2 style={{ fontWeight: 600, fontSize: 32, margin: '48px 0 12px 0', color: '#fff' }}>Account</h2>
                <div style={{ color: '#E7DCC9', fontSize: 16, marginBottom: 28 }}>
                  Account management coming soon.
                </div>
              </div>
            )}
          </div>
        </main>
         {/* Bottom navigation bar with divider */}
         <div style={{
           width: '100vw',
           height: '0.75px',
           background: 'rgba(231,220,201,0.5)',
           position: 'fixed',
           left: 0,
           bottom: 64,
           zIndex: 101,
         }} />
         <div className="bottom-nav">
           <div className={`bottom-nav__item${activeTab === 'projects' ? ' bottom-nav__item--active' : ''}`} onClick={() => setActiveTab('projects')} tabIndex={0} role="button">
             <FolderOpen className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
             <span className="bottom-nav__label">Projects</span>
           </div>
           <div className={`bottom-nav__item${activeTab === 'agents' ? ' bottom-nav__item--active' : ''}`} onClick={() => {
             if (lastProjectId) navigate(`/project/${lastProjectId}`)
           }} tabIndex={0} role="button">
             <Flower2 className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
             <span className="bottom-nav__label">Agents</span>
           </div>
           <div className={`bottom-nav__item${activeTab === 'account' ? ' bottom-nav__item--active' : ''}`} onClick={() => setActiveTab('account')} tabIndex={0} role="button">
             <CircleUserRound className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
             <span className="bottom-nav__label">Account</span>
           </div>
         </div>
      </div>
    </div>
  )
}

export default DashboardPage 