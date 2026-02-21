import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  TrendingUp,
  Percent,
  AlertTriangle,
  Package,
  Factory,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { KPICard } from '@/components/kpi/KPICard'
import { ChannelCard } from '@/components/channel/ChannelCard'
import { SKUTable } from '@/components/sku/SKUTable'
import {
  globalKPI,
  channelPerformance,
  skus,
  campaigns,
  formatIDRShort,
} from '@/data/mockData'
import { useAppStore } from '@/store/useAppStore'
import { alerts as mockAlerts } from '@/data/mockData'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const { selectedChannel, setAlerts } = useAppStore()

  useEffect(() => {
    setAlerts(mockAlerts.map((a) => ({ ...a, read: a.read })))
  }, [setAlerts])

  const filteredChannels =
    selectedChannel === 'all'
      ? channelPerformance
      : channelPerformance.filter((c) => c.channel === selectedChannel)

  const filteredSkus =
    selectedChannel === 'all'
      ? skus
      : skus.filter((s) => s.channel === selectedChannel)

  return (
    <div className="p-6 lg:p-10 space-y-12">
      {/* Header section - Focus on fixing the massive title */}
      <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4 py-1 transition-all">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Commerce Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time performance metrics across all nodes</p>
        </div>
        <div className="flex gap-3">
          {/* Action buttons could go here */}
        </div>
      </div>

      {/* Global KPI Row */}
      <section aria-label="Global KPIs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <KPICard
            title="Total Revenue"
            value={formatIDRShort(globalKPI.totalRevenue)}
            change="+12% WoW"
            changeType="positive"
            trend="up"
            icon={DollarSign}
            accent="blue"
          />
          <KPICard
            title="Net Profit"
            value={formatIDRShort(globalKPI.netProfit)}
            change="+8.2%"
            changeType="positive"
            trend="up"
            icon={TrendingUp}
            accent="green"
          />
          <KPICard
            title="Blended Margin"
            value={`${globalKPI.profitMarginPct}%`}
            change={`+${globalKPI.marginChangePct}pp`}
            changeType="positive"
            trend="up"
            icon={Percent}
            accent="teal"
          />
          <KPICard
            title="Margin Change"
            value={`+${globalKPI.marginChangePct}pp`}
            change="vs prior period"
            changeType="positive"
            trend="up"
            accent="purple"
          />
          <KPICard
            title="Risk Index"
            value={globalKPI.riskAlertsCount}
            change="Action Needed"
            changeType="negative"
            trend="down"
            icon={AlertTriangle}
            accent="red"
          />
          <KPICard
            title="Inventory Node"
            value={globalKPI.inventoryPressureScore}
            change="MODERATE"
            changeType="neutral"
            icon={Package}
            accent="amber"
          />
        </div>
      </section>

      {/* Channel Performance Grid */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Marketplace Insight</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredChannels.map((ch) => (
            <ChannelCard key={ch.channel} data={ch} onExpand={() => { }} />
          ))}
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* SKU Intelligence Table */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">SKU Intelligence List</h2>
            <Link
              to="/sku"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 hover:translate-x-1 transition-all flex items-center gap-1"
            >
              Master Node <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <SKUTable data={filteredSkus} maxRows={10} onRowExpand={() => { }} />
        </section>

        {/* Dashboard Side Panels */}
        <section className="space-y-10">
          {/* Campaign Analyzer */}
          <div className="glass-card group p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Campaign Node</h2>
              </div>
              <Link to="/campaigns" className="text-gray-400 hover:text-foreground transition-all">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-5">
              {campaigns.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between group/item">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground group-hover/item:text-blue-500 transition-colors tracking-tight">{c.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{c.channel}</p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold mb-1",
                      c.roas >= 3 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                        c.roas >= 2 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}>
                      {c.roas}x ROAS
                    </div>
                    <p className="text-[10px] font-mono font-bold text-gray-500">{formatIDRShort(c.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-3 rounded-xl border border-border bg-muted/30 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:bg-muted hover:text-foreground transition-all">
              Launch Intelligence
            </button>
          </div>

          {/* Production Priority */}
          <div className="glass-card group p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-5">
              <Factory className="h-4 w-4 text-blue-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Production Node</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-4">
                <p className="text-[9px] font-extrabold text-green-600 uppercase tracking-tighter">RESTOCK</p>
                <div className="flex flex-col gap-2">
                  {['Rose Mist', 'Eye Cream'].map(item => (
                    <div key={item} className="p-2 rounded-lg bg-green-500/5 border border-green-500/10 text-[9px] text-green-700 dark:text-green-400 font-bold">{item}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[9px] font-extrabold text-amber-600 uppercase tracking-tighter">MONITOR</p>
                <div className="flex flex-col gap-2">
                  {['Serum C', 'Sunscreen'].map(item => (
                    <div key={item} className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[9px] text-amber-700 dark:text-amber-400 font-bold">{item}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[9px] font-extrabold text-red-600 uppercase tracking-tighter">STOP</p>
                <div className="flex flex-col gap-2">
                  {['Trial Set', 'Premium'].map(item => (
                    <div key={item} className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-[9px] text-red-700 dark:text-red-400 font-bold">{item}</div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-8 text-[10px] text-gray-500 italic leading-relaxed border-t border-border pt-4">
              Priorities calculated via velocity mapping.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
