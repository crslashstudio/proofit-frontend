import { useState, useEffect } from 'react'
import {
    Globe,
    Building2,
    User,
    ExternalLink,
    Loader2,
    ShieldCheck,
    Lock,
    RefreshCw,
    Unlink
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

type Tab = 'integrations' | 'workspace' | 'profile'

interface Integration {
    id: string
    channel: string
    shopId: string
    shopName: string
    isActive: boolean
    createdAt: string
}

const CHANNELS = [
    {
        id: 'tiktok',
        name: 'TikTok Shop',
        color: '#FE2C55',
        description: 'Sync orders, products and campaigns from TikTok Shop',
        letter: 'T',
        available: true
    },
    {
        id: 'shopify',
        name: 'Shopify',
        color: '#96BF48',
        description: 'Connect your Shopify store for unified analytics',
        letter: 'S',
        available: false
    },
    {
        id: 'shopee',
        name: 'Shopee',
        color: '#FF5722',
        description: 'Import Shopee orders and product performance',
        letter: 'S',
        available: false
    },
    {
        id: 'lazada',
        name: 'Lazada',
        color: '#0F146D',
        description: 'Sync Lazada marketplace data',
        letter: 'L',
        available: false
    },
    {
        id: 'tokopedia',
        name: 'Tokopedia',
        color: '#42B549',
        description: 'Connect Tokopedia store analytics',
        letter: 'T',
        available: false
    }
]

export function Settings() {
    const { t, user } = useAppStore()
    const [activeTab, setActiveTab] = useState<Tab>('integrations')
    const [integrations, setIntegrations] = useState<Integration[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    const [disconnecting, setDisconnecting] = useState(false)
    const [workspaceName, setWorkspaceName] = useState('My Workspace')

    useEffect(() => {
        fetchIntegrations()
    }, [])

    const fetchIntegrations = async () => {
        try {
            setLoading(true)
            const response = await api.get('/integrations')
            const data = response.data?.data || []
            setIntegrations(data)
        } catch (error: any) {
            console.error('[Settings] Failed to fetch integrations:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const getIntegration = (channelId: string): Integration | undefined => {
        return integrations.find(i => i.channel === channelId && i.isActive === true)
    }

    const handleConnect = async (channelId: string) => {
        if (channelId === 'tiktok') {
            try {
                const response = await api.get('/integrations/tiktok/connect')
                if (response.data.success) {
                    window.location.href = response.data.data.authUrl
                }
            } catch (error: any) {
                alert('Gagal connect: ' + (error.response?.data?.error || error.message))
            }
        }
    }

    const handleSync = async () => {
        try {
            setSyncing(true)
            const response = await api.post('/integrations/tiktok/sync')
            if (response.data.success) {
                const { orders, products } = response.data.data
                alert(`✅ Berhasil sync ${orders} orders dan ${products} produk dari TikTok Shop`)
            }
        } catch (error: any) {
            alert('❌ Sync gagal: ' + (error.response?.data?.error || error.message))
        } finally {
            setSyncing(false)
        }
    }

    const handleDisconnect = async (channelId: string) => {
        if (!confirm('Yakin ingin memutus koneksi?')) return
        try {
            setDisconnecting(true)
            await api.delete(`/integrations/${channelId}`)
            await fetchIntegrations()
        } catch (error: any) {
            alert('Gagal disconnect: ' + (error.response?.data?.error || error.message))
        } finally {
            setDisconnecting(false)
        }
    }

    const renderIntegrations = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {t('channelIntegrations')}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                    {t('connectMarketplace')}
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-[var(--text-muted)]">Loading...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CHANNELS.map(channel => {
                        const integration = getIntegration(channel.id)
                        const isConnected = !!integration

                        return (
                            <div
                                key={channel.id}
                                className={cn(
                                    "rounded-2xl border p-5 transition-all duration-200",
                                    "bg-[var(--bg-secondary)]",
                                    isConnected
                                        ? "border-green-500/40"
                                        : "border-[var(--border)] hover:border-[var(--border-hover)]"
                                )}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                        style={{ backgroundColor: channel.color }}
                                    >
                                        {channel.letter}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                                            {channel.name}
                                        </h3>
                                        {isConnected ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                                                {t('connected')}
                                            </span>
                                        ) : !channel.available ? (
                                            <span className="inline-flex items-center text-[10px] font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                                {t('comingSoon')}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                                                {t('notConnected')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Shop name */}
                                {isConnected && integration?.shopName && (
                                    <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                                        🏪 {integration.shopName}
                                    </p>
                                )}

                                {/* Description */}
                                <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                                    {channel.description}
                                </p>

                                {/* Buttons */}
                                {isConnected ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSync}
                                            disabled={syncing}
                                            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            {syncing ? (
                                                <><Loader2 className="w-3 h-3 animate-spin" /> Syncing...</>
                                            ) : (
                                                <><RefreshCw className="w-3 h-3" /> Sync Sekarang</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDisconnect(channel.id)}
                                            disabled={disconnecting}
                                            className="px-3 py-2 rounded-xl text-xs font-semibold border border-red-300 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-all flex items-center gap-1"
                                        >
                                            <Unlink className="w-3 h-3" />
                                            {disconnecting ? '...' : 'Putus'}
                                        </button>
                                    </div>
                                ) : channel.available ? (
                                    <button
                                        onClick={() => handleConnect(channel.id)}
                                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-blue-500 hover:text-blue-500 text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {t('connectChannel')}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]"
                                    >
                                        {t('comingSoon')}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )

    const renderWorkspace = () => (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('workspace')}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Manage your workspace settings</p>
            </div>
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        {t('workspaceName')}
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all outline-none text-[var(--text-primary)]"
                        />
                    </div>
                </div>
                <button className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                    {t('saveChanges')}
                </button>
            </div>
        </div>
    )

    const renderProfile = () => (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('profile')}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Manage your account</p>
            </div>
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white">
                        {user?.email?.substring(0, 2).toUpperCase() || 'P'}
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--text-primary)]">{user?.email}</h3>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">Administrator</p>
                    </div>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">
                            {t('changePassword')}
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                {t('newPassword')}
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm outline-none text-[var(--text-primary)] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                {t('confirmPassword')}
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm outline-none text-[var(--text-primary)] transition-all"
                            />
                        </div>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-8 pb-10">
            <section className="flex flex-col gap-1 px-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 rounded-md bg-blue-500/10 flex items-center justify-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Workspace Settings</p>
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('settings')}</h1>
            </section>

            <section className="px-1">
                <div className="flex gap-2 p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-2xl w-fit">
                    {(['integrations', 'workspace', 'profile'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                                activeTab === tab
                                    ? "bg-[var(--bg-secondary)] text-blue-500 shadow-sm border border-[var(--border)]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            {tab === 'integrations' && <Globe className="h-3.5 w-3.5" />}
                            {tab === 'workspace' && <Building2 className="h-3.5 w-3.5" />}
                            {tab === 'profile' && <User className="h-3.5 w-3.5" />}
                            {t(tab as any)}
                        </button>
                    ))}
                </div>
            </section>

            <section className="px-1">
                {activeTab === 'integrations' && renderIntegrations()}
                {activeTab === 'workspace' && renderWorkspace()}
                {activeTab === 'profile' && renderProfile()}
            </section>
        </div>
    )
}
