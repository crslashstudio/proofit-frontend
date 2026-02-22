import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Globe,
    Building2,
    User,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Loader2,
    ShieldCheck,
    Lock,
    Check,
    Clock
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
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>('integrations')
    const [connecting, setConnecting] = useState(false)

    const [channels] = useState<Channel[]>(INITIAL_CHANNELS)
    const [tiktokConnected, setTiktokConnected] = useState(false)
    const [tiktokShopName, setTiktokShopName] = useState('')
    const [syncing, setSyncing] = useState(false)
    const [syncSuccess, setSyncSuccess] = useState(false)
    const [disconnecting, setDisconnecting] = useState(false)
    const [workspaceName, setWorkspaceName] = useState('My Workspace')

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const response = await api.get('/integrations')
                const integrations = response.data.data || []
                const tiktok = integrations.find((i: any) => i.channel === 'tiktok' && i.is_active)
                if (tiktok) {
                    setTiktokConnected(true)
                    setTiktokShopName(tiktok.shop_name)
                }
            } catch (error) {
                console.error('Failed to fetch integrations:', error)
            }
        }
        fetchIntegrations()
    }, [])

    const handleSync = async () => {
        try {
            setSyncing(true)
            const response = await api.post('/integrations/tiktok/sync')
            if (response.data.success) {
                const { orders, products } = response.data.data
                alert(`Berhasil sync ${orders} orders and ${products} produk`)
                setSyncSuccess(true)
                setTimeout(() => setSyncSuccess(false), 3000)
            }
        } catch (error: any) {
            console.error('Sync error:', error)
            alert('Sync gagal: ' + (error.response?.data?.error || error.message))
        } finally {
            setSyncing(false)
        }
    }

    const handleConnectTikTok = async () => {
        try {
            setConnecting(true)
            const token = localStorage.getItem('proofit_token')
            if (!token) {
                navigate('/login')
                return
            }
            const response = await api.get('/integrations/tiktok/connect')
            if (response.data.success) {
                window.location.href = response.data.data.authUrl
            } else {
                console.error('Connection failed:', response.data.message)
                alert(t('connectionError'))
            }
        } catch (error: any) {
            console.error('Connect error:', error)
            if (error.response?.status !== 401) {
                alert(t('connectionError'))
            }
        } finally {
            setConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        if (!confirm('Yakin ingin memutus koneksi TikTok Shop?')) return
        try {
            setDisconnecting(true)
            await api.delete('/integrations/tiktok')
            setTiktokConnected(false)
            setTiktokShopName('')
            alert('TikTok Shop berhasil diputus')
        } catch (error: any) {
            alert('Gagal memutus: ' + (error.response?.data?.error || error.message))
        } finally {
            setDisconnecting(false)
        }
    }

    const renderIntegrations = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('channelIntegrations')}</h2>
                <p className="text-sm text-[var(--text-muted)] font-medium">{t('connectMarketplace')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((ch) => {
                    const isConnected = ch.id === 'tiktok' ? tiktokConnected : ch.status === 'connected'
                    return (
                        <div
                            key={ch.id}
                            className="glass-card p-5 border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden relative group transition-all hover:shadow-lg hover:border-[var(--border-hover)]"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                        style={{ backgroundColor: ch.color }}
                                    >
                                        {ch.letter}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)]">{ch.name}</h3>
                                        <div className="mt-0.5">
                                            {isConnected ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {ch.id === 'tiktok' ? 'TERHUBUNG' : t('connected')}
                                                </span>
                                            ) : ch.status === 'coming_soon' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {t('comingSoon')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider border border-[var(--border)]">
                                                    {ch.id === 'tiktok' ? 'BELUM TERHUBUNG' : t('notConnected')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isConnected && ch.id === 'tiktok' && (
                                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-blue-500" />
                                    {tiktokShopName || 'Official Store'}
                                </p>
                            )}

                            <p className="text-xs text-[var(--text-muted)] mb-5 leading-relaxed">
                                {ch.description}
                            </p>

                            <div className="flex items-center gap-2">
                                {isConnected ? (
                                    <>
                                        {ch.id === 'tiktok' && (
                                            <>
                                                <button
                                                    onClick={handleSync}
                                                    disabled={syncing}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                                                        syncSuccess
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95"
                                                    )}
                                                >
                                                    {syncing ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Syncing...
                                                        </>
                                                    ) : syncSuccess ? (
                                                        <>
                                                            <Check className="h-4 w-4" />
                                                            Synced
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Sync Sekarang
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleDisconnect}
                                                    disabled={disconnecting}
                                                    className="px-4 py-2 border border-red-500/30 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-wider"
                                                >
                                                    {disconnecting ? '...' : 'Putus'}
                                                </button>
                                            </>
                                        )}
                                        {ch.id !== 'tiktok' && (
                                            <button
                                                className="w-full px-4 py-2 border border-red-500/50 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-wider"
                                            >
                                                Putuskan
                                            </button>
                                        )}
                                    </>
                                ) : ch.status === 'coming_soon' ? (
                                    <button
                                        disabled
                                        className="w-full px-4 py-2 rounded-xl text-xs font-bold text-gray-400 bg-[var(--bg-tertiary)] cursor-not-allowed uppercase tracking-wider border border-[var(--border)]"
                                    >
                                        {t('comingSoon')}
                                    </button>
                                ) : (
                                    <button
                                        disabled={connecting && ch.id === 'tiktok'}
                                        onClick={() => ch.id === 'tiktok' && handleConnectTikTok()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-wider"
                                    >
                                        {connecting && ch.id === 'tiktok' ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                Hubungkan Channel
                                                <ExternalLink className="h-3 w-3" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

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
