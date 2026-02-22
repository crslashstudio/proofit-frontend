import { useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'
import { TopNav } from '@/components/navigation/TopNav'
import { Sidebar } from '@/components/navigation/Sidebar'
import { AIInsightPanel } from '@/components/ai/AIInsightPanel'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const {
    theme,
    mobileMenuOpen,
    setMobileMenuOpen,
    aiPanelVisible,
    toggleAiPanel
  } = useAppStore()

  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen, setMobileMenuOpen])

  return (
    <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-300 selection:bg-blue-500/30 font-sans antialiased overflow-hidden">
      <div className="flex h-full overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-all duration-300 md:hidden" />
        )}

        {/* Sidebar - Responsive */}
        <div
          ref={drawerRef}
          className={cn(
            "fixed inset-y-0 left-0 z-[70] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="relative h-full flex items-stretch">
            <Sidebar toggleSidebar={() => { }} />
            {/* Mobile Close Button inside Sidebar area or next to it */}
            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 -right-12 p-2 bg-white dark:bg-sidebar rounded-full shadow-xl md:hidden text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <TopNav />
          <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 bg-gray-50/30 dark:bg-transparent" style={{ height: 'calc(100vh - 56px)' }}>
            <div className="w-full max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* AI Insight Panel - Responsive Positioning */}
        <div className={cn(
          "fixed inset-y-0 right-0 z-[60] transition-transform duration-500 ease-in-out border-l border-border bg-background shadow-2xl xl:relative xl:translate-x-0 xl:z-auto xl:shadow-none xl:w-[300px] xl:shrink-0 xl:block",
          aiPanelVisible ? "translate-x-0" : "translate-x-full xl:hidden"
        )}>
          <AIInsightPanel />
        </div>
      </div>

      {/* Floating AI Button for Mobile/Tablet */}
      <button
        onClick={toggleAiPanel}
        className={cn(
          "fixed bottom-6 right-6 z-[50] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 xl:hidden",
          aiPanelVisible ? "rotate-180 opacity-0 pointer-events-none" : "rotate-0 opacity-100"
        )}
      >
        <Sparkles className="h-6 w-6 fill-white/20" />
      </button>
    </div>
  )
}
