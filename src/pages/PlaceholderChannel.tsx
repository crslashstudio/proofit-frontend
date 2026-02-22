import { useParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function PlaceholderChannel() {
    const { channelId } = useParams()
    const { t } = useAppStore()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="h-16 w-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4 uppercase">
                {channelId} {t('channelOverview') || 'Channel Overview'}
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
                We are currently calibrating the deep-dive analytics for this specific marketplace. Aggregate data is still available on your main dashboard.
            </p>
        </div>
    )
}
