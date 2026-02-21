import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/navigation/TopNav'
import { Sidebar } from '@/components/navigation/Sidebar'
import { AIInsightPanel } from '@/components/ai/AIInsightPanel'
import { useAppStore } from '@/store/useAppStore'

export function DashboardLayout() {
  const { theme } = useAppStore()

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="flex h-screen flex-col bg-background text-foreground selection:bg-blue-500/30 font-sans antialiased transition-colors duration-300">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar toggleSidebar={() => { }} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent">
          <Outlet />
        </main>
        <AIInsightPanel />
      </div>
    </div>
  )
}
