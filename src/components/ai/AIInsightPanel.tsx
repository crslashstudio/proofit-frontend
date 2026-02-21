import { useState } from 'react'
import { Sparkles, RefreshCw, AlertTriangle, TrendingUp, ListOrdered, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiInsight } from '@/data/mockData'

export function AIInsightPanel() {
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState(0)
  const data = aiInsight

  const handleRegenerate = () => {
    setLoading(true)
    setKey((k) => k + 1)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-l border-border bg-gray-50/80 dark:bg-black/60 backdrop-blur-2xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#3B82F6] fill-[#3B82F6]/20" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">AI Insight</h2>
        </div>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="rounded-full p-2 text-gray-400 hover:bg-muted dark:hover:bg-white/5 hover:text-foreground disabled:opacity-50 transition-all font-bold"
          aria-label="Regenerate insight"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="flex-1 space-y-0 overflow-y-auto px-6 py-4 scrollbar-none">
        {loading ? (
          <div className="space-y-6" key={key}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-2 w-1/3 rounded-full bg-border" />
                <div className="space-y-2">
                  <div className="h-1.5 rounded-full bg-muted" />
                  <div className="h-1.5 w-5/6 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Executive Summary */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <Sparkles className="h-3 w-3" />
                Executive Summary
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400 font-medium font-sans">
                {data.executiveSummary}
              </p>
            </section>

            <div className="h-px bg-border" />

            {/* Top 3 Risks */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <AlertTriangle className="h-3 w-3 text-[#EF4444]" />
                Risk Assessment
              </h3>
              <ul className="space-y-3">
                {data.topRisks.map((risk, i) => (
                  <li
                    key={i}
                    className="group rounded-xl border-l-2 border-red-400 bg-red-50 dark:bg-[#EF4444]/5 p-3 text-xs text-red-700 dark:text-[#F8F8FF] leading-relaxed transition-all hover:bg-red-100 dark:hover:bg-[#EF4444]/10"
                  >
                    {risk}
                  </li>
                ))}
              </ul>
            </section>

            {/* Top 3 Opportunities */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <TrendingUp className="h-3 w-3 text-[#10B981]" />
                Growth Opportunities
              </h3>
              <ul className="space-y-3">
                {data.topOpportunities.map((opp, i) => (
                  <li
                    key={i}
                    className="group rounded-xl border-l-2 border-green-500 bg-green-50 dark:bg-[#10B981]/5 p-3 text-xs text-green-700 dark:text-[#F8F8FF] leading-relaxed transition-all hover:bg-green-100 dark:hover:bg-[#10B981]/10"
                  >
                    {opp}
                  </li>
                ))}
              </ul>
            </section>

            {/* Action Priorities */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <ListOrdered className="h-3 w-3 text-[#3B82F6]" />
                Critical Actions
              </h3>
              <div className="space-y-3">
                {data.actionPriorities.map((action, i) => (
                  <div
                    key={i}
                    className="flex gap-4 rounded-xl border border-border bg-white dark:bg-white/5 p-3 text-xs text-gray-500 dark:text-gray-400 group hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/5 transition-all shadow-sm dark:shadow-none"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 font-bold text-[#3B82F6] text-[10px] group-hover:bg-[#3B82F6] group-hover:text-white transition-all">
                      {i + 1}
                    </span>
                    <span className="group-hover:text-foreground transition-all">{action}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* Strategic Observation */}
            <section className="space-y-3 pb-6">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <Lightbulb className="h-3 w-3 text-[#F59E0B]" />
                Strategic Observation
              </h3>
              <p className="text-xs italic leading-relaxed text-gray-500 border-l border-border pl-4 py-1">
                {data.strategicObservation}
              </p>
            </section>

            <button
              onClick={handleRegenerate}
              className="w-full py-3 rounded-xl border border-border text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-blue-500/10"
            >
              Regenerate Analysis
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
