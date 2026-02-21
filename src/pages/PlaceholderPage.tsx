import { useLocation } from 'react-router-dom'

const TITLES: Record<string, string> = {
  '/sku': 'SKU Intelligence',
  '/campaigns': 'Campaigns',
  '/production': 'Production',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export function PlaceholderPage() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Page'

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-[#71717a]">This section is coming soon.</p>
    </div>
  )
}
