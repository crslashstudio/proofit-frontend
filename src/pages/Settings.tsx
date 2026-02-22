import { useState, useEffect } from 'react'
import {
    Globe,
    Building2,
    User,
    ExternalLink,
    Loader2,
    ShieldCheck,
    Lock
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

type Tab = 'integrations' | 'workspace' | 'profile'

interface Channel {
    id: string
    name: string
    color: string
    description: string
    status: 'connected' | 'not_connected' | 'coming_soon'
    letter: string
    shopName?: string
    shopId?: string
}

const INITIAL_CHANNELS: Channel[] = [
    {
        id: 'tiktok',
        name: 'TikTok Shop',
        color: '#FE2C55',
        description: 'Sync orders, products and campaigns from TikTok Shop',
        status: 'not_connected',
        letter: 'T'
    },
    {
        id: 'shopify',
        name: 'Shopify',
        color: '#96BF48',
        description: 'Connect your Shopify store for unified analytics',
        status: 'coming_soon',
        letter: 'S'
    },
    {
        id: 'shopee',
        name: 'Shopee',
        color: '#FF5722',
        description: 'Import Shopee orders and product performance',
        status: 'coming_soon',
        letter: 'S'
    },
    {
        id: 'lazada',
        name: 'Lazada',
        color: '#0F146D',
        description: 'Sync Lazada marketplace data',
        status: 'coming_soon',
        letter: 'L'
    },
    {
        id: 'tokopedia',
        name: 'Tokopedia',
        color: '#42B549',
        description: 'Connect Tokopedia store analytics',
        status: 'coming_soon',
        letter: 'T'
    }
]

export function Settings() {
    const { t, user } = useAppStore()
    const [activeTab, setActiveTab] = useState<Tab>('integrations')
    const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS)
    const [tiktokStatus, setTiktokStatus] = useState<{
        connected: boolean
        shopName: string
        shopId: string
    } | null>(null)
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    const [disconnecting, setDisconnecting] = useState(false)
    const [workspaceName, setWorkspaceName] = useState('My Workspace')

    useEffect(() => {
        let mounted = true

        const fetchIntegrations = async () => {
            try {
                setLoading(true)
                console.log('[Settings] Fetching integrations...')
                const response = await api.get('/integrations')
                console.log('[Settings] Response:', response.data)

                if (!mounted) return

                const integrations = response.data?.data || []
                console.log('[Settings] Integrations:', integrations)

                const tiktok = integrations.find(
                    (i: any) => i.channel === 'tiktok' && i.isActive === true
                )
                console.log('[Settings] TikTok integration:', tiktok)

                if (tiktok && mounted) {
                    setTiktokStatus({
                        connected: true,
                        shopName: tiktok.shopName || 'TikTok Shop',
                        shopId: tiktok.shopId || ''
                    })
                    // Update channels state
                    setChannels(prev => prev.map(ch =>
                        ch.id === 'tiktok'
                            ? { ...ch, status: 'connected' as const, shopName: tiktok.shopName }
                            : ch
                    ))
                    console.log('[Settings] TikTok connected:', tiktok.shopName)
                }
            } catch (error: any) {
                console.error('[Settings] Error:', error.message)
                if (error.response?.status === 401) {
                    window.location.href = '/login'
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchIntegrations()
        return () => { mounted = false }
    }, [])

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
        if (!confirm('Yakin ingin memutus koneksi TikTok Shop?')) return
        try {
            setDisconnecting(true)
            await api.delete(`/integrations/${channelId}`)
            setChannels(prev => prev.map(ch =>
                ch.id === channelId
                    ? { ...ch, status: 'not_connected' as const, shopName: undefined }
                    : ch
            ))
        } catch (error: any) {
            alert('Gagal disconnect: ' + (error.response?.data?.error || error.message))
        } finally {
            setDisconnecting(false)
        }
    }

    const renderIntegrations = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-[var(--text-muted)]">Loading integrations...</span>
                </div>
            )
        }

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('channelIntegrations')}</h2>
                    <p className="text-sm text-[var(--text-muted)] font-medium">{t('connectMarketplace')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channels.map(channel => (
                        <div
                            key={channel.id}
                            className={cn(
                                "rounded-2xl border p-5 transition-all duration-200",
                                "bg-[var(--bg-secondary)] border-[var(--border)]",
                                "hover:border-[var(--border-hover)]",
                                channel.status === 'connected' && "border-green-500/30"
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
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
                                        {channel.id === 'tiktok' ? (
                                            tiktokStatus?.connected ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full mt-0.5">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"></span>
                                                    {t('connected')} • {tiktokStatus.shopName}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5 block font-bold">
                                                    {t('notConnected')}
                                                </span>
                                            )
                                        ) : (
                                            channel.status === 'coming_soon' && (
                                                <span className="inline-flex items-center text-[10px] font-medium bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full mt-0.5">
                                                    {t('comingSoon')}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Shop name if connected */}
                            {channel.status === 'connected' && channel.shopName && channel.id !== 'tiktok' && (
                                <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                                    🏪 {channel.shopName}
                                </p>
                            )}

                            {/* Description */}
                            <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                                {channel.description}
                            </p>

                            {/* Action Buttons */}
                            {channel.id === 'tiktok' ? (
                                tiktokStatus?.connected ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSync}
                                            disabled={syncing}
                                            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            {syncing ? <><Loader2 className="w-3 h-3 animate-spin" /> Syncing...</> : '↻ Sync Sekarang'}
                                        </button>
                                        <button
                                            onClick={() => handleDisconnect('tiktok')}
                                            disabled={disconnecting}
                                            className="px-3 py-2 rounded-xl text-xs font-semibold border border-red-300 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-all"
                                        >
                                            {disconnecting ? '...' : 'Putus'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleConnect('tiktok')}
                                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-blue-500 text-[var(--text-primary)] hover:text-blue-500 flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {t('connectChannel')}
                                    </button>
                                )
                            ) : channel.status === 'coming_soon' ? (
                                <button disabled className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[var(--text-muted)] cursor-not-allowed">
                                    {t('comingSoon')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleConnect(channel.id)}
                                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-blue-500 text-[var(--text-primary)] hover:text-blue-500 flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    {t('connectChannel')}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderWorkspace = () => (
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('workspace')}</h2>
                <p className="text-sm text-[var(--text-muted)] font-medium">Manage your workspace settings and preferences</p>
            </div>

            <div className="glass-card p-6 border border-[var(--border)] bg-[var(--bg-secondary)] space-y-6 shadow-sm">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{t('workspaceName')}</label>
                    <div className="relative group">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium transition-all outline-none text-[var(--text-primary)] shadow-sm"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-wider">
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    )

    const renderProfile = () => (
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('profile')}</h2>
                <p className="text-sm text-[var(--text-muted)] font-medium">Personalize your account and security</p>
            </div>

            <div className="glass-card p-6 border border-[var(--border)] bg-[var(--bg-secondary)] space-y-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20 ring-4 ring-white/10">
                        {user?.email?.substring(0, 2).toUpperCase() || 'P'}
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--text-primary)]">{user?.email || 'user@example.com'}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Administrator</p>
                    </div>
                </div>

                <div className="h-px bg-[var(--border)]" />

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">{t('changePassword')}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{t('newPassword')}</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-2.5 px-4 text-sm font-medium transition-all outline-none text-[var(--text-primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{t('confirmPassword')}</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-2.5 px-4 text-sm font-medium transition-all outline-none text-[var(--text-primary)]"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-wider">
                            {t('saveChanges')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-8 pb-10">
            {/* Top Header Section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-5 w-5 rounded-md bg-blue-500/10 flex items-center justify-center">
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Workspace Settings</p>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">{t('settings')}</h1>
                </div>
            </section>

            {/* Settings Navigation */}
            <section className="px-1">
                <div className="flex gap-2 p-1.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-2xl w-fit shadow-sm">
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                            activeTab === 'integrations'
                                ? "bg-[var(--bg-secondary)] text-blue-500 shadow-sm border border-[var(--border)]"
                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
                        )}
                    >
                        <Globe className="h-3.5 w-3.5" />
                        {t('integrations')}
                    </button>
                    <button
                        onClick={() => setActiveTab('workspace')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                            activeTab === 'workspace'
                                ? "bg-[var(--bg-secondary)] text-blue-500 shadow-sm border border-[var(--border)]"
                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
                        )}
                    >
                        <Building2 className="h-3.5 w-3.5" />
                        {t('workspace')}
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                            activeTab === 'profile'
                                ? "bg-[var(--bg-secondary)] text-blue-500 shadow-sm border border-[var(--border)]"
                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
                        )}
                    >
                        <User className="h-3.5 w-3.5" />
                        {t('profile')}
                    </button>
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
