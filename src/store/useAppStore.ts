import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChannelId } from '@/data/mockData'
import { translations, type Language } from '@/i18n/translations'

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

interface User {
  id: string
  email: string
  name?: string
}

interface AppState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  selectedChannel: ChannelId
  // ... existing props
  selectedWorkspace: string
  dateRange: DateRange
  alerts: Alert[]
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  aiPanelVisible: boolean
  theme: 'light' | 'dark'
  language: Language
  setChannel: (channel: ChannelId) => void
  setWorkspace: (workspaceId: string) => void
  setDateRange: (range: DateRange) => void
  setAlerts: (alerts: Alert[]) => void
  markAlertRead: (id: string) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setAiPanelVisible: (visible: boolean) => void
  toggleAiPanel: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations['id']) => string
}

const defaultDateRange: DateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  to: new Date(),
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('proofit_token'),
      isAuthenticated: !!localStorage.getItem('proofit_token'),

      setAuth: (user, token) => {
        localStorage.setItem('proofit_token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('proofit_token')
        set({ user: null, token: null, isAuthenticated: false })
        window.location.href = '/login'
      },

      selectedChannel: 'all',
      selectedWorkspace: 'ws-1',
      dateRange: defaultDateRange,
      alerts: [],
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      aiPanelVisible: window.innerWidth >= 1280,
      theme: 'light',
      language: 'id',
      // ... existing actions

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
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setAiPanelVisible: (visible) => set({ aiPanelVisible: visible }),
      toggleAiPanel: () => set((state) => ({ aiPanelVisible: !state.aiPanelVisible })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const { language } = get()
        return translations[language][key] || key
      },
    }),
    {
      name: 'proofit-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        user: state.user,
      }),
    }
  )
)
