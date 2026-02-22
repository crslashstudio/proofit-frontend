import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Megaphone,
  Factory,
  FileBarChart,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

export function Sidebar({ toggleSidebar: _ignore }: { toggleSidebar: () => void }) {
  const { sidebarCollapsed, toggleSidebar, t } = useAppStore()

  const NAV_ITEMS = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/sku', label: t('skuIntelligence'), icon: Package },
    { to: '/campaigns', label: t('campaign'), icon: Megaphone },
    { to: '/production', label: t('production'), icon: Factory },
    { to: '/reports', label: 'Reports', icon: FileBarChart },
    { to: '/settings', label: t('settings'), icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-gray-100 dark:border-border bg-white dark:bg-sidebar transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-14' : 'w-[220px]'
      )}
    >
      <nav className="flex flex-1 flex-col gap-1.5 p-3" aria-label="Main">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 group',
                isActive
                  ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 shadow-sm dark:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                  : 'text-gray-400 hover:bg-muted dark:hover:bg-white/5 hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-all group-hover:scale-110", "stroke-[1.5]")} aria-hidden />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
                {isActive && !sidebarCollapsed && (
                  <div className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="hidden md:block border-t border-gray-100 dark:border-border p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-400 hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-all"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px]" />
              <span className="truncate font-semibold uppercase tracking-widest text-[10px]">{t('collapse')}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
