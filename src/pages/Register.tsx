import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function Register() {
    useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        workspaceName: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await api.post('/auth/register', formData)
            navigate('/login')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

            <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl relative z-10">
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
                    <CardTitle className="text-xl font-bold">Join PROOFIT</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                        Commerce Decision Intelligence
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="rounded-xl border-border/50 bg-background/50 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="rounded-xl border-border/50 bg-background/50 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="workspaceName">Workspace Name</Label>
                            <Input
                                id="workspaceName"
                                placeholder="My Brand"
                                value={formData.workspaceName}
                                onChange={handleChange}
                                required
                                className="rounded-xl border-border/50 bg-background/50 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="rounded-xl border-border/50 bg-background/50 focus:ring-2 focus:ring-blue-500"
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
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
