import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function Login() {
    useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()
    const { setAuth } = useAppStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await api.post('/auth/login', { email, password })
            if (response.data.success) {
                const { session, user } = response.data.data
                localStorage.setItem('proofit_token', session.access_token)
                setAuth(user, session.access_token)
                navigate('/dashboard')
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

            <Card className="w-full max-w-md border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl shadow-2xl rounded-2xl relative z-10">
                <CardHeader className="space-y-2 text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                                <Zap className="h-6 w-6 text-white fill-white/20" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                                PROOFIT
                            </span>
                        </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-[var(--text-primary)]">Welcome back</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                        Commerce Decision Intelligence
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-xl border-[var(--border)] bg-[var(--bg-secondary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-xl border-[var(--border)] bg-[var(--bg-secondary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[var(--text-primary)]"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl py-6 font-semibold text-white hover:opacity-90 shadow-lg shadow-blue-500/20 h-12"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
