import { useState, useRef, useEffect } from 'react'
import { Zap, Bell, ChevronDown, Sparkles, Calendar, Moon, Sun, LayoutGrid } from 'lucide-react'
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
    selectedChannel,
    setChannel,
    selectedWorkspace,
    setWorkspace,
    dateRange,
    setDateRange,
    alerts,
    markAlertRead,
    theme,
    toggleTheme,
  } = useAppStore()

  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)

  const workspaceRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)
  const alertsRef = useRef<HTMLDivElement>(null)

  const unreadCount = alerts.filter((a) => !a.read).length
  const currentWorkspace =
    workspaces.find((w) => w.id === selectedWorkspace) ?? workspaces[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        workspaceRef.current?.contains(e.target as Node) === false &&
        dateRef.current?.contains(e.target as Node) === false &&
        alertsRef.current?.contains(e.target as Node) === false
      ) {
        setWorkspaceOpen(false)
        setDateOpen(false)
        setAlertsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fromStr = dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const toStr = dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header className="sticky top-0 z-50 flex h-[52px] shrink-0 items-center gap-4 border-b border-border bg-white/80 dark:bg-black/60 px-6 backdrop-blur-2xl transition-all duration-300">
      {/* Logo */}
      <a href="/" className="flex shrink-0 items-center gap-2 group">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 transition-all group-hover:scale-110">
          <Zap className="h-4 w-4 text-[#3B82F6] fill-[#3B82F6]/20" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gradient">PROOFIT</span>
      </a>

      {/* Workspace selector - Pill shape */}
      <div className="relative shrink-0 ml-4 hidden md:block" ref={workspaceRef}>
        <button
          type="button"
          onClick={() => setWorkspaceOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-border bg-muted/50 dark:bg-white/5 px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted dark:hover:bg-white/10 transition-all"
        >
          <span>{currentWorkspace?.name ?? 'Select Workspace'}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-gray-500 transition-transform duration-300', workspaceOpen && 'rotate-180')} />
        </button>
        {workspaceOpen && (
          <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border bg-card py-1 shadow-2xl backdrop-blur-xl">
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
                  w.id === selectedWorkspace ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                )}
              >
                {w.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Channel tabs - Marketplace Icons */}
      <nav className="flex items-center gap-2 ml-6 bg-muted/50 dark:bg-white/5 p-1 rounded-full border border-border" aria-label="Channel filter">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setChannel(ch.id)}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-full p-1.5 transition-all duration-300 min-w-[44px]',
              selectedChannel === ch.id
                ? 'bg-blue-500/15 ring-1 ring-blue-500/30'
                : 'hover:bg-muted dark:hover:bg-white/5 text-gray-500'
            )}
            title={ch.label}
          >
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm",
                selectedChannel === ch.id ? "scale-110" : "scale-100"
              )}
              style={{
                backgroundColor: ch.id === 'all' ? '#1E1E2E' : ch.color,
                color: '#FFFFFF'
              }}
            >
              {ch.id === 'all' ? <LayoutGrid className="h-4 w-4" /> : ch.letter}
            </div>
            <span className={cn(
              "text-[8px] mt-0.5 font-bold tracking-tighter transition-all",
              selectedChannel === ch.id ? "text-blue-500" : "text-gray-500"
            )}>
              {ch.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-gray-400 hover:bg-muted dark:hover:bg-white/5 transition-all"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Date range - compact pill */}
        <div className="relative hidden lg:block" ref={dateRef}>
          <button
            type="button"
            onClick={() => setDateOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-border bg-muted/50 dark:bg-white/5 px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted dark:hover:bg-white/10 transition-all font-mono"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{fromStr} – {toStr}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', dateOpen && 'rotate-180')} />
          </button>
          {dateOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-2xl">
              <button
                type="button"
                className="w-full rounded-lg px-4 py-2 text-left text-xs text-foreground hover:bg-muted"
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

        {/* Alerts */}
        <div className="relative" ref={alertsRef}>
          <button
            type="button"
            onClick={() => setAlertsOpen((o) => !o)}
            className="relative rounded-full p-2 text-gray-400 hover:bg-muted dark:hover:bg-white/5 transition-all"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>
          {alertsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card py-2 shadow-2xl backdrop-blur-xl">
              <div className="px-4 py-2 border-b border-border">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Alerts</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-gray-500">No active alerts</p>
                ) : (
                  alerts.slice(0, 5).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => markAlertRead(a.id)}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors border-b border-border last:border-0',
                        !a.read ? 'bg-blue-500/5' : 'hover:bg-muted'
                      )}
                    >
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">{a.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Brief button - Gradient + glow */}
        <button
          type="button"
          className="group relative hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] px-5 py-2 text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          <Sparkles className="h-3.5 w-3.5 fill-white/20" />
          AI Brief
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
        </button>

        {/* User profile */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-bold text-foreground hover:bg-muted transition-all cursor-pointer">
          JD
        </div>
      </div>
    </header>
  )
}
