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
        'glass-card group p-5 transition-all duration-300 hover:scale-[1.01] dark:hover:border-white/12 shadow-sm',
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
        <div className="flex items-center gap-2 mb-3">
          {Icon && (
            <div className="rounded-lg bg-gray-100 dark:bg-white/5 p-1.5 transition-colors group-hover:bg-primary/10">
              <Icon className="h-4 w-4 text-gray-400 transition-colors group-hover:text-primary" />
            </div>
          )}
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{title}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {(change !== undefined || trend !== 'neutral') && (
            <div className="flex items-center gap-2 mt-2">
              <div className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
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
