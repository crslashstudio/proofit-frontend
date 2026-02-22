import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TrendDirection = 'up' | 'down' | 'neutral'
export type ChangeType = 'positive' | 'negative' | 'neutral'
export type KPIAccent = 'blue' | 'green' | 'teal' | 'purple' | 'red' | 'amber' | 'neutral'

const ACCENT_COLORS: Record<KPIAccent, string> = {
  blue: '3B82F6',
  green: '10B981',
  teal: '14B8A6',
  purple: '8B5CF6',
  red: 'EF4444',
  amber: 'F59E0B',
  neutral: '6B7280',
}

interface KPICardProps {
  title: string
  value: string | number
  change?: string
  changeType?: ChangeType
  trend?: TrendDirection
  tooltip?: string
  icon?: LucideIcon
  accent?: KPIAccent
  className?: string
}

export function KPICard({
  title,
  value,
  change,
  changeType = 'neutral',
  trend = 'neutral',
  tooltip,
  icon: Icon,
  accent = 'neutral',
  className,
}: KPICardProps) {
  const accentColor = ACCENT_COLORS[accent]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 md:p-5 transition-all duration-300 group min-w-0",
        "bg-white dark:bg-card shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none dark:border dark:border-border",
        "hover:translate-y-[-2px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] dark:hover:border-primary/30",
        className
      )}
      style={{
        ['--hover-glow' as any]: `rgba(${accent === 'blue' ? '59, 130, 246' :
          accent === 'green' ? '16, 185, 129' :
            accent === 'teal' ? '20, 184, 166' :
              accent === 'purple' ? '139, 92, 246' :
                accent === 'red' ? '239, 68, 68' :
                  accent === 'amber' ? '245, 158, 11' : '107, 114, 128'}, 0.08)`
      } as React.CSSProperties}
      title={tooltip}
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px blur-sm opacity-50 dark:opacity-100"
        style={{ backgroundColor: `#${accentColor}` }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {Icon && (
            <div className="rounded-lg bg-gray-100 dark:bg-white/5 p-1 transition-colors group-hover:bg-primary/10 shrink-0">
              <Icon className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-primary" />
            </div>
          )}
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 line-clamp-2 leading-tight">{title}</p>
        </div>

        <div className="flex flex-col">
          <p className="text-xl font-bold tabular-nums tracking-tight text-foreground truncate">
            {value}
          </p>
          {(change !== undefined || trend !== 'neutral') && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className={cn(
                "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold shrink-0",
                changeType === 'positive' ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                  changeType === 'negative' ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-muted text-gray-500"
              )}>
                {trend === 'up' && "↑"}
                {trend === 'down' && "↓"}
                {change}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover glow effect background (Dark Mode Only) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden dark:block"
        style={{
          background: `radial-gradient(circle at top center, var(--hover-glow), transparent 70%)`
        }}
      />
    </div>
  )
}
