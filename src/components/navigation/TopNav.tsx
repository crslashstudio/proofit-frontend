import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Bell, ChevronDown, Calendar, Moon, Sun, LayoutGrid, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { workspaces } from '@/data/mockData'
import type { ChannelId } from '@/data/mockData'

const CHANNELS: { id: ChannelId; label: string; color: string; letter: string }[] = [
  { id: 'all', label: 'ALL', color: '#71717a', letter: 'A' },
  { id: 'tiktok', label: 'TIKTOK', color: '#FE2C55', letter: 'T' },
  { id: 'shopify', label: 'SHOPIFY', color: '#96BF48', letter: 'S' },
  { id: 'shopee', label: 'SHOPEE', color: '#FF5722', letter: 'S' },
  { id: 'lazada', label: 'LAZADA', color: '#0F146D', letter: 'L' },
  { id: 'tokopedia', label: 'TOKOPEDIA', color: '#42B549', letter: 'T' },
]

export function TopNav() {
  const {
    user,
    logout,
    selectedChannel,
    setChannel,
    selectedWorkspace,
    setWorkspace,
    dateRange,
    setDateRange,
    alerts,
    theme,
    toggleTheme,
    language,
    setLanguage,
    toggleMobileMenu,
  } = useAppStore()

  const navigate = useNavigate()
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const workspaceRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)
  const alertsRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = alerts.filter((a) => !a.read).length
  const currentWorkspace =
    workspaces.find((w) => w.id === selectedWorkspace) ?? workspaces[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        workspaceRef.current?.contains(e.target as Node) === false &&
        dateRef.current?.contains(e.target as Node) === false &&
        alertsRef.current?.contains(e.target as Node) === false &&
        dropdownRef.current?.contains(e.target as Node) === false
      ) {
        setWorkspaceOpen(false)
        setDateOpen(false)
        setAlertsOpen(false)
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('proofit_token')
    logout() // Use the store's logout
    window.location.href = '/login'
  }

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || '??'
  const userEmail = user?.email || ''

  const fromStr = dateRange.from.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })
  const toStr = dateRange.to.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header className="sticky top-0 z-[100] flex h-[52px] w-full shrink-0 items-center border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 px-4 md:px-6 backdrop-blur-xl transition-all duration-300 shadow-sm flex-nowrap overflow-hidden">
      {/* Mobile Menu Toggle - Fixed width */}
      <button
        type="button"
        onClick={toggleMobileMenu}
        className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-muted md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo - Fixed width */}
      <a href="/" className="flex shrink-0 items-center gap-2 group mr-2 md:mr-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 transition-all group-hover:scale-110">
          <Zap className="h-4 w-4 text-[#3B82F6] fill-[#3B82F6]/20" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gradient hidden xs:block">PROOFIT</span>
      </a>

      {/* Workspace selector - Contained */}
      <div className="relative shrink-0 hidden md:block mr-2" ref={workspaceRef}>
        <button
          type="button"
          onClick={() => setWorkspaceOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
        >
          <span className="truncate max-w-[100px]">{currentWorkspace?.name ?? 'Select Workspace'}</span>
          <ChevronDown className={cn('h-3 w-3 shrink-0 text-[var(--text-muted)] transition-transform duration-300', workspaceOpen && 'rotate-180')} />
        </button>
        {workspaceOpen && (
          <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 z-[110]">
            {workspaces.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setWorkspace(w.id)
                  setWorkspaceOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  w.id === selectedWorkspace ? 'bg-primary/10 text-primary font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                )}
              >
                {w.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Channel tabs - Optimized for fill and scroll */}
      <div className="flex-1 flex items-center justify-center px-2 md:px-4 overflow-hidden min-w-0">
        <nav className="flex items-center gap-1 bg-muted/30 dark:bg-white/5 p-0.5 rounded-full border border-border overflow-x-auto scrollbar-none max-w-full no-scrollbar" aria-label="Channel filter">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setChannel(ch.id)}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-full p-1 transition-all duration-300 min-w-[32px] md:min-w-[40px] shrink-0',
                selectedChannel === ch.id
                  ? 'bg-blue-500/15 ring-1 ring-blue-500/30'
                  : 'hover:bg-muted dark:hover:bg-white/5 text-gray-400'
              )}
              title={ch.label}
            >
              <div
                className={cn(
                  "flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-lg text-[10px] md:text-xs font-bold transition-all shadow-sm",
                  selectedChannel === ch.id ? "scale-105 shadow-md" : "scale-100"
                )}
                style={{
                  backgroundColor: ch.id === 'all' ? '#1E1E2E' : ch.color,
                  color: '#FFFFFF'
                }}
              >
                {ch.id === 'all' ? <LayoutGrid className="h-3.5 w-3.5 md:h-4 w-4" /> : ch.letter}
              </div>
              <span className={cn(
                "hidden md:block text-[8px] mt-0.5 font-bold tracking-tighter transition-all",
                selectedChannel === ch.id ? "text-blue-500" : "text-gray-400"
              )}>
                {ch.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Right actions - Consolidated and non-shrinking */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0 ml-auto pl-2">
        {/* Language Switcher - Very compact */}
        <div className="hidden xs:flex bg-muted rounded-full p-0.5 shrink-0">
          <button
            onClick={() => setLanguage('id')}
            className={cn(
              "px-1.5 py-0.5 text-[8px] font-bold transition-all duration-300",
              language === 'id' ? "bg-primary text-white rounded-full shadow-sm" : "text-gray-400"
            )}
          >
            ID
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              "px-1.5 py-0.5 text-[8px] font-bold transition-all duration-300",
              language === 'en' ? "bg-primary text-white rounded-full shadow-sm" : "text-gray-400"
            )}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-muted shrink-0"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Date range - Responsive pill */}
        <div className="relative shrink-0" ref={dateRef}>
          <button
            type="button"
            onClick={() => setDateOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-[10px] md:text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block truncate max-w-[140px] font-mono">{fromStr} – {toStr}</span>
            <ChevronDown className={cn('h-3 w-3 shrink-0 hidden sm:block transition-transform duration-300', dateOpen && 'rotate-180')} />
          </button>
          {dateOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[110]">
              <button
                type="button"
                className="w-full rounded-lg px-4 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                onClick={() => {
                  const to = new Date()
                  const from = new Date(to)
                  from.setDate(from.getDate() - 7)
                  setDateRange({ from, to })
                  setDateOpen(false)
                }}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-4 py-2 text-left text-xs text-foreground hover:bg-muted"
                onClick={() => {
                  const to = new Date()
                  const from = new Date(to)
                  from.setDate(from.getDate() - 30)
                  setDateRange({ from, to })
                  setDateOpen(false)
                }}
              >
                Last 30 Days
              </button>
            </div>
          )}
        </div>

        {/* Alerts & Profile - Compact */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="relative" ref={alertsRef}>
            <button
              type="button"
              onClick={() => setAlertsOpen((o) => !o)}
              className="relative h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-muted transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />}
            </button>
            {alertsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 z-[110]">
                <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Alerts</span>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.slice(0, 3).map(a => (
                      <div key={a.id} className="px-3 py-2 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] group cursor-pointer transition-colors">
                        <p className="text-[11px] font-bold truncate group-hover:text-primary text-[var(--text-primary)]">{a.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{a.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-[11px] text-[var(--text-muted)] text-center">No alerts</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative z-[110]" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all z-40 relative shadow-md active:scale-95"
            >
              {userInitials}
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-tertiary)]/50">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Signed in as</p>
                  <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{userEmail}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setShowDropdown(false); navigate('/settings') }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-primary)] flex items-center gap-2 rounded-lg font-medium"
                  >
                    <span>⚙️</span> Pengaturan
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 rounded-lg font-bold"
                  >
                    <span>→</span> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
