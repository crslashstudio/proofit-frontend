import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatIDRShort } from '@/data/mockData'
import type { ChannelPerformance } from '@/data/mockData'

const CHANNEL_COLORS: Record<string, string> = {
  tiktok: '#FE2C55',
  shopify: '#96BF48',
  shopee: '#FF5722',
  lazada: '#0F146D',
  tokopedia: '#42B549',
}

const CHANNEL_LABELS: Record<string, string> = {
  shopee: 'SHOPEE',
  tokopedia: 'TOKOPEDIA',
  lazada: 'LAZADA',
  tiktok: 'TIKTOK',
  shopify: 'SHOPIFY',
}

function riskScoreColorClass(score: number): string {
  if (score < 30) return 'text-green-600 dark:text-[#10B981] bg-green-500/10 border-green-500/20'
  if (score <= 60) return 'text-amber-600 dark:text-[#F59E0B] bg-amber-500/10 border-amber-500/20'
  return 'text-red-600 dark:text-[#EF4444] bg-red-500/10 border-red-500/20'
}

interface ChannelCardProps {
  data: ChannelPerformance
  onExpand?: () => void
  className?: string
}

export function ChannelCard({ data, onExpand, className }: ChannelCardProps) {
  const accent = CHANNEL_COLORS[data.channel] ?? '#3B82F6'
  const label = CHANNEL_LABELS[data.channel] ?? data.channel.toUpperCase()

  return (
    <div
      className={cn(
        'glass-card group transition-all duration-300 hover:scale-[1.01] dark:hover:border-white/12 shadow-sm',
        className
      )}
    >
      {/* Channel brand line */}
      <div
        className="h-[2px] w-full"
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 opacity-80 group-hover:opacity-100 transition-opacity">
            {label}
          </h3>
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-extrabold transition-all group-hover:scale-110",
            riskScoreColorClass(data.riskScore)
          )} title="Risk Score">
            {data.riskScore}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-3">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 font-bold">Revenue</p>
            <p className="text-sm font-bold tabular-nums text-foreground">{formatIDRShort(data.revenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 font-bold">Profit</p>
            <p className="text-sm font-bold tabular-nums text-green-600 dark:text-[#10B981]">{formatIDRShort(data.netProfit)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 font-bold">Margin</p>
            <p className="text-sm font-bold tabular-nums text-foreground">{data.marginPct}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.1em] text-gray-400 font-bold">Contribution</p>
            <p className="text-sm font-bold tabular-nums text-foreground">{data.contributionPct}%</p>
          </div>
        </div>

        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border border-border hover:bg-muted hover:text-foreground transition-all"
          >
            Insights <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Subtle background glow (Dark Mode Only) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none hidden dark:block"
        style={{ background: `radial-gradient(circle at center, ${accent}, transparent 80%)` }}
      />
    </div>
  )
}
