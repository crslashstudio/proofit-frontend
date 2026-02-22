
interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {


  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="h-20 w-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
        <div className="h-10 w-10 border-2 border-dashed border-blue-500 rounded-lg animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">{title}</h1>
      <p className="text-gray-500 max-w-md mx-auto">
        This module is currently under development as part of our Phase 2 intelligence rollout. Check back soon for deeper analytics.
      </p>
    </div>
  )
}
