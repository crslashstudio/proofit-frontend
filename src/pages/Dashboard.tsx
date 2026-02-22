import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Sparkles,
  Percent,
  AlertTriangle,
  Package,
  ShoppingCart,
  ChevronRight
} from 'lucide-react'
import {
  globalKPI,
  channelPerformance,
  skus,
  campaigns,
  formatIDR
} from '@/data/mockData'
import { KPICard } from '@/components/kpi/KPICard'
import { ChannelCard } from '@/components/channel/ChannelCard'
import { SKUTable } from '@/components/sku/SKUTable'
import { useAppStore } from '@/store/useAppStore'

export function Dashboard() {
  const { selectedChannel, t } = useAppStore()

  const filteredChannels = useMemo(() => {
    if (selectedChannel === 'all') return channelPerformance
    return channelPerformance.filter((ch) => ch.channel === selectedChannel)
  }, [selectedChannel])

  const filteredSkus = useMemo(() => {
    if (selectedChannel === 'all') return skus
    return skus.filter((sku) => sku.channel === selectedChannel)
  }, [selectedChannel])

  const activeCampaigns = useMemo(() => {
    return campaigns.filter(c => c.status === 'active')
  }, [])

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{t('executiveSummary')}</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-[0.2em]">Real-time Performance Intelligence</p>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="px-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          <KPICard
            title={t('totalRevenue')}
            value={formatIDR(globalKPI.totalRevenue)}
            change="+12.5%"
            changeType="positive"
            trend="up"
            icon={TrendingUp}
            accent="blue"
          />
          <KPICard
            title={t('netProfit')}
            value={formatIDR(globalKPI.netProfit)}
            change="+8.2%"
            changeType="positive"
            trend="up"
            icon={TrendingUp}
            accent="green"
          />
          <KPICard
            title={t('blendedMargin')}
            value={`${globalKPI.profitMarginPct}%`}
            change="+2.3pp"
            changeType="positive"
            trend="up"
            icon={Percent}
            accent="teal"
          />
          <KPICard
            title={t('marginChange')}
            value={`${globalKPI.marginChangePct}%`}
            change="WOW"
            changeType="positive"
            trend="up"
            accent="purple"
          />
          <KPICard
            title={t('riskIndex')}
            value={globalKPI.riskAlertsCount}
            change="HIGH RISK"
            changeType="negative"
            trend="down"
            icon={AlertTriangle}
            accent="red"
          />
          <KPICard
            title={t('inventoryNode')}
            value={`${globalKPI.inventoryPressureScore}`}
            change="MODERATE"
            changeType="neutral"
            icon={Package}
            accent="amber"
          />
        </div>
      </section>

      {/* Analytics Main Section */}
      <div className="space-y-8 md:space-y-10 px-1">
        {/* Marketplace Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-blue-500 rounded-full" />
              <h2 className="text-base font-bold tracking-tight text-foreground uppercase tracking-widest">{t('channelPerformance')}</h2>
            </div>
            <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-widest">{t('insights')} →</button>
          </div>

          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredChannels.map((channel) => (
              <div key={channel.channel} className="min-w-[180px] snap-start flex-shrink-0 md:flex-shrink">
                <ChannelCard data={channel} onExpand={() => { }} />
              </div>
            ))}
          </div>
        </section>

        {/* SKU Section */}
        <section className="bg-white/30 dark:bg-white/[0.01] rounded-[2rem] p-4 md:p-6 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground uppercase tracking-widest">{t('skuIntelligence')}</h2>
              <p className="text-[9px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Performance Tracking</p>
            </div>
            <div className="flex bg-muted/50 p-0.5 rounded-lg shrink-0">
              <button className="px-3 py-1 text-[9px] font-bold text-white bg-blue-500 rounded-md shadow-sm uppercase">Profitability</button>
              <button className="px-3 py-1 text-[9px] font-bold text-gray-400 hover:text-foreground transition-all uppercase">Inventory</button>
            </div>
          </div>
          <SKUTable data={filteredSkus} />
        </section>

        {/* Bottom Section - Campaigns and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold tracking-tight text-foreground uppercase tracking-widest">{t('campaign')}</h2>
              <Link to="/campaigns" className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-widest">View All</Link>
            </div>
            <div className="space-y-3">
              {activeCampaigns.slice(0, 3).map(campaign => (
                <div key={campaign.id} className="glass-card p-4 flex items-center justify-between border-none dark:border dark:border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <ShoppingCart className="h-4.5 w-4.5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{campaign.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{campaign.channel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{campaign.roas}x</p>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">ROAS</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2 glass-card p-6 border-none dark:border dark:border-border bg-gradient-to-br from-blue-600/5 to-indigo-600/5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h2 className="text-base font-bold tracking-tight text-foreground uppercase tracking-widest">AI Intelligence Brief</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Your portfolio margin improved by <span className="text-emerald-500 font-bold">+2.3pp</span> this week. However, <span className="text-red-500 font-bold">3 SKUs</span> in Shopee are currently burning cash.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-border">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Top Risk</p>
                <p className="text-xs font-bold text-foreground truncate">Premium Box Set Margin: -13%</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-border">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Top Opportunity</p>
                <p className="text-xs font-bold text-foreground truncate">Scale Looky Gems Bundle</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
