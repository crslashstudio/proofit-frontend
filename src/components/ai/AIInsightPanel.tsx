import { useRef, useEffect } from 'react'
import { Sparkles, TrendingUp, AlertCircle, Zap, Target, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { aiInsight } from '@/data/mockData'

export function AIInsightPanel() {
  const { language, setAiPanelVisible, aiPanelVisible, t } = useAppStore()
  const content = aiInsight[language]
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset scroll on language change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [language])

  if (!aiPanelVisible) return null

  return (
    <aside className={cn(
      "flex flex-col h-full bg-gray-50/80 dark:bg-[#0A0A0B] backdrop-blur-xl w-full md:w-[320px] transition-all duration-300 border-l border-gray-200 dark:border-border"
    )}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 dark:border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
          </div>
          <h2 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
            PRO-{t('aiInsight')}
          </h2>
        </div>
        <button
          onClick={() => setAiPanelVisible(false)}
          className="xl:hidden p-1.5 hover:bg-muted rounded-full text-gray-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
      >
        {/* Executive Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('executiveSummary')}</h3>
          </div>
          <p className="text-xs leading-relaxed text-foreground font-medium bg-white/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm">
            {content.executiveSummary}
          </p>
        </section>

        {/* Strategic Observation */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-blue-500" />
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('strategicObservation')}</h3>
          </div>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 italic">
            "{content.strategicObservation}"
          </p>
        </section>

        {/* Top Risks */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('riskAssessment')}</h3>
          </div>
          <div className="space-y-3">
            {content.topRisks.map((risk, i) => (
              <div key={i} className="flex gap-3 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] p-3 rounded-xl border border-amber-500/10">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">{risk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Opportunities */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('growthOpportunities')}</h3>
          </div>
          <div className="space-y-3">
            {content.topOpportunities.map((opp, i) => (
              <div key={i} className="flex gap-3 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] p-3 rounded-xl border border-emerald-500/10">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">{opp}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Priorities / Actions */}
        <section className="space-y-4 pb-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{t('criticalActions')}</h3>
          <div className="space-y-2">
            {content.actionPriorities.map((item, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <span className="text-[11px] text-gray-600 dark:text-gray-400 leading-tight group-hover:text-foreground transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}
