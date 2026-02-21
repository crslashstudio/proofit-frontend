import { create } from 'zustand'
import type { ChannelId } from '@/data/mockData'

export interface Alert {
  id: string
  type: 'risk' | 'inventory' | 'margin' | 'campaign'
  title: string
  message: string
  channel?: ChannelId
  createdAt: string
  read: boolean
}

interface DateRange {
  from: Date
  to: Date
}

interface AppState {
  selectedChannel: ChannelId
  selectedWorkspace: string
  dateRange: DateRange
  alerts: Alert[]
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  setChannel: (channel: ChannelId) => void
  setWorkspace: (workspaceId: string) => void
  setDateRange: (range: DateRange) => void
  setAlerts: (alerts: Alert[]) => void
  markAlertRead: (id: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const defaultDateRange: DateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  to: new Date(),
}

export const useAppStore = create<AppState>((set) => ({
  selectedChannel: 'all',
  selectedWorkspace: 'ws-1',
  dateRange: defaultDateRange,
  alerts: [],
  sidebarCollapsed: false,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

  setChannel: (channel) => set({ selectedChannel: channel }),
  setWorkspace: (workspaceId) => set({ selectedWorkspace: workspaceId }),
  setDateRange: (dateRange) => set({ dateRange }),
  setAlerts: (alerts) => set({ alerts }),
  markAlertRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      return { theme: newTheme }
    }),
}))
