import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import { LogOut, Trash, FolderOpen, Flower2, CircleUserRound, SquareTerminal } from 'lucide-react'
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
  // Add state for userName at the top of DashboardPage
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');

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
      setProjects(prev => {
        const updated = prev.filter(project => project.id !== id)
        if (lastProjectId === id) {
          if (updated.length > 0) {
            localStorage.setItem('lastProjectId', updated[0].id)
            setLastProjectId(updated[0].id)
          } else {
            localStorage.removeItem('lastProjectId')
            setLastProjectId(null)
          }
        }
        return updated
      })
    }
  }

  // Update userName in localStorage when changed in the account form
  const handleAccountSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('accountName') as HTMLInputElement;
    const name = nameInput?.value?.trim() || '';
    setUserName(name);
    localStorage.setItem('userName', name);
    // Optionally show a save confirmation
  };

  return (
    <div className="dashboard-container" style={{
      minHeight: '100vh',
      minWidth: '100vw',
      position: 'relative',
      overflow: 'hidden',
      display: 'block',
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
          height: 64,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 24,
        }}>
          <h1 className="touchgrass-logo" style={{ margin: 0, fontWeight: 700, fontSize: 17, letterSpacing: '0.04em', color: '#fff', fontFamily: 'Cera Pro, sans-serif', fontVariant: 'small-caps', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 22, lineHeight: 1, marginRight: 2 }}>🌱</span>gotouchgrass
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
        <main className="dashboard-main" style={{
          marginTop: 88, // 64px header + 24px extra
          width: '100%',
        }}>
          <div className="dashboard-content" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}>
            {activeTab === 'projects' && (
              projects.length === 0 ? (
                <div style={{
                  maxWidth: 400,
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
                    {`Hi ${userName || 'there'},`}
                  </h2>
                  <div style={{ color: '#E7DCC9', fontSize: 15, marginBottom: 28 }}>
                    import your github project &<br />continue building from your phone
                  </div>
                  <form className="repo-form" onSubmit={handleAddProject} style={{ width: '80vw', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <SquareTerminal size={18} color="#a89c85" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        type="url"
                        className="repo-input"
                        placeholder="https://github.com/username/repo or git@github.com:username/repo.git"
                        value={repoUrl}
                        onChange={e => setRepoUrl(e.target.value)}
                        required
                        style={{
                          background: '#E7DCC9',
                          color: '#8C7C63',
                          fontFamily: 'Cera Pro, sans-serif',
                          border: 'none',
                          borderRadius: 8,
                          padding: '12px 16px 12px 44px',
                          fontSize: 15,
                          outline: 'none',
                          boxShadow: 'none',
                          width: '100%',
                          height: 36,
                          marginBottom: 0
                        }}
                      />
                      <style>{`
                        .repo-input::placeholder {
                          font-size: 10px !important;
                          color: #a89c85 !important;
                        }
                      `}</style>
                    </div>
                    <button type="submit" className="repo-add-btn" style={{
                      background: '#cbbfae',
                      color: '#232e25',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      width: '100%',
                      height: 36,
                      marginTop: 0,
                      fontFamily: 'Cera Pro, sans-serif',
                      boxShadow: 'none',
                      transition: 'background 0.2s',
                      padding: '10px 0'
                    }}>Clone</button>
                  </form>
                  {error && <div className="error-message">{error}</div>}
                </div>
              ) : (
                <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ marginBottom: 8 }}>
                    <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 6px 0', fontFamily: 'Cera Pro, sans-serif', letterSpacing: '0.01em', textAlign: 'left' }}>Import new project</h2>
                    <form className="repo-form" onSubmit={handleAddProject} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch', marginBottom: 10 }}>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <SquareTerminal size={18} color="#a89c85" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                          type="url"
                          className="repo-input"
                          placeholder="https://github.com/username/repo or git@github.com:username/repo.git"
                          value={repoUrl}
                          onChange={e => setRepoUrl(e.target.value)}
                          required
                          style={{
                            background: '#E7DCC9',
                            color: '#8C7C63',
                            fontFamily: 'Cera Pro, sans-serif',
                            border: 'none',
                            borderRadius: 8,
                            padding: '12px 16px 12px 44px',
                            fontSize: 15,
                            outline: 'none',
                            boxShadow: 'none',
                            width: '100%',
                            height: 36,
                            marginBottom: 0
                          }}
                        />
                        <style>{`
                          .repo-input::placeholder {
                            font-size: 10px !important;
                            color: #a89c85 !important;
                          }
                        `}</style>
                      </div>
                      <button type="submit" className="repo-add-btn" style={{
                        background: '#cbbfae',
                        color: '#232e25',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        width: '100%',
                        height: 36,
                        marginTop: 0,
                        fontFamily: 'Cera Pro, sans-serif',
                        boxShadow: 'none',
                        transition: 'background 0.2s',
                        padding: '10px 0'
                      }}>Clone</button>
                    </form>
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <h2 style={{ margin: '8px 0 4px 0', fontWeight: 700, fontSize: 16, color: '#fff', fontFamily: 'Cera Pro, sans-serif', letterSpacing: '0.01em', textAlign: 'left' }}>Your Projects</h2>
                  </div>
                  <div className="projects-grid" style={{ marginTop: 0, width: '100%', gap: 12 }}>
                    {projects.map(project => (
                      <div
                        className="project-card clickable"
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        tabIndex={0}
                        role="button"
                        style={{
                          cursor: 'pointer',
                          position: 'relative',
                          background: 'rgba(231,220,201,0.85)',
                          borderRadius: 10,
                          padding: '10px 14px',
                          minHeight: 44,
                          marginBottom: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          boxShadow: 'none',
                          border: 'none',
                          width: '100%'
                        }}
                      >
                        <div className="project-info" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="project-icon"><FolderOpen size={18} color="var(--color-accent)" /></div>
                          <div>
                            <div className="project-name" style={{ fontSize: 14, fontWeight: 600, color: '#232e25', marginBottom: 2 }}>{project.name.replace(/^[^/]+\//, '').replace(/\.git$/, '')}</div>
                            <a className="project-link" href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: '#6a6a5e', textDecoration: 'underline', wordBreak: 'break-all' }}>
                              {project.repoUrl}
                            </a>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: 4,
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
                          <Trash size={13} color="#000" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            {activeTab === 'account' && (
              <div style={{ maxWidth: 520, width: '100%', margin: '0 auto', textAlign: 'left', padding: 0, marginTop: 8 }}>
                <h2 style={{ fontWeight: 600, fontSize: 24, margin: '0 0 12px 0', color: '#fff', textAlign: 'left', fontFamily: 'Cera Pro, sans-serif' }}>Account</h2>
                <form onSubmit={handleAccountSave} style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'stretch', boxShadow: 'none', border: 'none', maxWidth: 520, width: '100%', margin: '0 auto' }}>
                  <label style={{ color: '#E7DCC9', fontWeight: 600, fontSize: 11, textAlign: 'left', marginBottom: 4, fontFamily: 'Cera Pro, sans-serif' }}>Name</label>
                  <input name="accountName" type="text" defaultValue={userName} style={{ width: '100%', background: '#E7DCC9', color: '#8C7C63', fontFamily: 'Cera Pro, sans-serif', fontWeight: 400, fontSize: 13, border: 'none', borderRadius: 8, padding: '10px 12px', marginBottom: 8, outline: 'none', boxShadow: 'none', transition: 'background 0.2s' }} />
                  <label style={{ color: '#E7DCC9', fontWeight: 600, fontSize: 11, textAlign: 'left', marginBottom: 4, fontFamily: 'Cera Pro, sans-serif' }}>Username</label>
                  <input type="text" defaultValue="rachie" style={{ width: '100%', background: '#E7DCC9', color: '#8C7C63', fontFamily: 'Cera Pro, sans-serif', fontWeight: 400, fontSize: 13, border: 'none', borderRadius: 8, padding: '10px 12px', marginBottom: 8, outline: 'none', boxShadow: 'none', transition: 'background 0.2s' }} />
                  <label style={{ color: '#E7DCC9', fontWeight: 600, fontSize: 11, textAlign: 'left', marginBottom: 4, fontFamily: 'Cera Pro, sans-serif' }}>Email</label>
                  <input type="email" defaultValue="rachie@email.com" style={{ width: '100%', background: '#E7DCC9', color: '#8C7C63', fontFamily: 'Cera Pro, sans-serif', fontWeight: 400, fontSize: 13, border: 'none', borderRadius: 8, padding: '10px 12px', outline: 'none', boxShadow: 'none', transition: 'background 0.2s' }} />
                  <button type="submit" className="repo-add-btn" style={{ marginTop: 18, fontWeight: 700, fontSize: 14, padding: '10px 0', borderRadius: 8, background: '#cbbfae', color: '#232e25', border: 'none', fontFamily: 'Cera Pro, sans-serif', boxShadow: 'none', transition: 'background 0.2s', width: '100%' }}>Save</button>
                  <button type="button" onClick={onLogout} style={{ marginTop: 8, fontWeight: 700, fontSize: 14, padding: '10px 0', borderRadius: 8, background: '#cbbfae', color: '#232e25', border: 'none', fontFamily: 'Cera Pro, sans-serif', boxShadow: 'none', transition: 'background 0.2s', width: '100%', cursor: 'pointer' }}>Log out</button>
                </form>
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
             <Flower2 className="bottom-nav__icon" size={18} color="#E7DCC9" strokeWidth={1.7} />
             <span className="bottom-nav__label">Projects</span>
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