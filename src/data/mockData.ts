// PROOFIT Commerce Decision Intelligence — Mock data (IDR, Indonesian e-commerce)

export type ChannelId = 'all' | 'tiktok' | 'shopify' | 'shopee' | 'lazada' | 'tokopedia'

export interface Workspace {
  id: string
  name: string
  brand: string
}

export interface Alert {
  id: string
  type: 'risk' | 'inventory' | 'margin' | 'campaign'
  title: string
  message: string
  channel?: ChannelId
  createdAt: string
  read: boolean
}

export type SKUClassification = 'star' | 'hidden_gem' | 'illusion_bestseller' | 'cash_burner' | 'neutral'

export interface SKU {
  id: string
  name: string
  channel: Exclude<ChannelId, 'all'>
  revenue: number
  netProfit: number
  marginPct: number
  volume: number
  inventory: number
  classification: SKUClassification
  riskFlag: boolean
}

export interface ChannelPerformance {
  channel: Exclude<ChannelId, 'all'>
  revenue: number
  netProfit: number
  marginPct: number
  contributionPct: number
  riskScore: number // 0-100
  orderCount: number
}

export interface Campaign {
  id: string
  name: string
  channel: Exclude<ChannelId, 'all'>
  spend: number
  revenue: number
  roas: number
  status: 'active' | 'paused' | 'ended'
}

export interface GlobalKPI {
  totalRevenue: number
  netProfit: number
  profitMarginPct: number
  marginChangePct: number
  riskAlertsCount: number
  inventoryPressureScore: number // 0-100
}

export interface AIInsightContent {
  executiveSummary: string
  topRisks: string[]
  topOpportunities: string[]
  actionPriorities: string[]
  strategicObservation: string
}

export interface AIInsight {
  en: AIInsightContent
  id: AIInsightContent
}

// ——— Workspaces ———
export const workspaces: Workspace[] = [
  { id: 'ws-1', name: 'Glow Beauty ID', brand: 'Glow Beauty' },
  { id: 'ws-2', name: 'TechHub Store', brand: 'TechHub' },
  { id: 'ws-3', name: 'Fashion Forward', brand: 'Fashion Forward' },
  { id: 'ws-4', name: 'Home Living Co', brand: 'Home Living' },
  { id: 'ws-5', name: 'Snack Nation', brand: 'Snack Nation' },
]

// ——— Alerts ———
export const alerts: Alert[] = [
  { id: 'a1', type: 'margin', title: 'Margin drop on Shopee', message: 'SKU "Serum Vitamin C" margin fell below 15%', channel: 'shopee', createdAt: '2025-02-21T08:00:00Z', read: false },
  { id: 'a2', type: 'inventory', title: 'Low stock alert', message: '3 SKUs below safety stock on Lazada', channel: 'lazada', createdAt: '2025-02-21T07:30:00Z', read: false },
  { id: 'a3', type: 'risk', title: 'Cash burner detected', message: '"Premium Box Set" has negative margin across channels', createdAt: '2025-02-21T06:00:00Z', read: true },
  { id: 'a4', type: 'campaign', title: 'TikTok campaign underperforming', message: 'ROAS dropped to 1.2x on "Summer Sale"', channel: 'tiktok', createdAt: '2025-02-20T22:00:00Z', read: false },
]

// ——— Global KPIs (IDR) ———
export const globalKPI: GlobalKPI = {
  totalRevenue: 4_872_500_000,
  netProfit: 876_050_000,
  profitMarginPct: 17.98,
  marginChangePct: 2.3,
  riskAlertsCount: 4,
  inventoryPressureScore: 62,
}

// ——— Channel performance ———
export const channelPerformance: ChannelPerformance[] = [
  { channel: 'shopee', revenue: 1_890_000_000, netProfit: 283_500_000, marginPct: 15.0, contributionPct: 38.8, riskScore: 35, orderCount: 12450 },
  { channel: 'tokopedia', revenue: 1_245_000_000, netProfit: 261_450_000, marginPct: 21.0, contributionPct: 25.5, riskScore: 28, orderCount: 8920 },
  { channel: 'lazada', revenue: 892_000_000, netProfit: 169_480_000, marginPct: 19.0, contributionPct: 18.3, riskScore: 45, orderCount: 5670 },
  { channel: 'tiktok', revenue: 545_000_000, netProfit: 98_100_000, marginPct: 18.0, contributionPct: 11.2, riskScore: 52, orderCount: 3420 },
  { channel: 'shopify', revenue: 300_500_000, netProfit: 63_520_000, marginPct: 21.2, contributionPct: 6.2, orderCount: 1890, riskScore: 22 },
]

// ——— SKUs (top 20, mixed classifications) ———
export const skus: SKU[] = [
  { id: 'sk-1', name: 'Serum Vitamin C 30ml', channel: 'shopee', revenue: 245_000_000, netProfit: 51_450_000, marginPct: 21.0, volume: 4200, inventory: 1200, classification: 'star', riskFlag: false },
  { id: 'sk-2', name: 'Moisturizer HA 50ml', channel: 'tokopedia', revenue: 189_000_000, netProfit: 45_360_000, marginPct: 24.0, volume: 3150, inventory: 800, classification: 'star', riskFlag: false },
  { id: 'sk-3', name: 'Face Mist Rose', channel: 'lazada', revenue: 78_500_000, netProfit: 23_550_000, marginPct: 30.0, volume: 1850, inventory: 450, classification: 'hidden_gem', riskFlag: false },
  { id: 'sk-4', name: 'Cleanser Gentle 100ml', channel: 'shopee', revenue: 312_000_000, netProfit: 31_200_000, marginPct: 10.0, volume: 5200, inventory: 2100, classification: 'illusion_bestseller', riskFlag: true },
  { id: 'sk-5', name: 'Premium Box Set', channel: 'tiktok', revenue: 95_000_000, netProfit: -12_350_000, marginPct: -13.0, volume: 380, inventory: 120, classification: 'cash_burner', riskFlag: true },
  { id: 'sk-6', name: 'Sunscreen SPF50 40ml', channel: 'shopee', revenue: 167_000_000, netProfit: 41_750_000, marginPct: 25.0, volume: 3340, inventory: 900, classification: 'star', riskFlag: false },
  { id: 'sk-7', name: 'Lip Tint Set', channel: 'tokopedia', revenue: 134_000_000, netProfit: 33_500_000, marginPct: 25.0, volume: 2680, inventory: 600, classification: 'star', riskFlag: false },
  { id: 'sk-8', name: 'Eye Cream 15ml', channel: 'lazada', revenue: 62_000_000, netProfit: 18_600_000, marginPct: 30.0, volume: 1240, inventory: 280, classification: 'hidden_gem', riskFlag: false },
  { id: 'sk-9', name: 'Toner AHA 200ml', channel: 'shopee', revenue: 198_000_000, netProfit: 19_800_000, marginPct: 10.0, volume: 3960, inventory: 1500, classification: 'illusion_bestseller', riskFlag: false },
  { id: 'sk-10', name: 'Mask Sheet 5pcs', channel: 'tiktok', revenue: 45_000_000, netProfit: -4_500_000, marginPct: -10.0, volume: 1500, inventory: 3200, classification: 'cash_burner', riskFlag: true },
  { id: 'sk-11', name: 'Body Lotion 250ml', channel: 'tokopedia', revenue: 89_000_000, netProfit: 22_250_000, marginPct: 25.0, volume: 1780, inventory: 420, classification: 'neutral', riskFlag: false },
  { id: 'sk-12', name: 'Hair Serum 50ml', channel: 'lazada', revenue: 56_000_000, netProfit: 16_800_000, marginPct: 30.0, volume: 1120, inventory: 190, classification: 'hidden_gem', riskFlag: false },
  { id: 'sk-13', name: 'BB Cream 30ml', channel: 'shopee', revenue: 278_000_000, netProfit: 27_800_000, marginPct: 10.0, volume: 5560, inventory: 1800, classification: 'illusion_bestseller', riskFlag: false },
  { id: 'sk-14', name: 'Bundling Kit Save', channel: 'shopify', revenue: 72_000_000, netProfit: 21_600_000, marginPct: 30.0, volume: 360, inventory: 85, classification: 'hidden_gem', riskFlag: false },
  { id: 'sk-15', name: 'Trial Set 3pcs', channel: 'tiktok', revenue: 38_000_000, netProfit: -2_280_000, marginPct: -6.0, volume: 1900, inventory: 2400, classification: 'cash_burner', riskFlag: true },
  { id: 'sk-16', name: 'Face Oil 20ml', channel: 'tokopedia', revenue: 98_000_000, netProfit: 29_400_000, marginPct: 30.0, volume: 1960, inventory: 310, classification: 'hidden_gem', riskFlag: false },
  { id: 'sk-17', name: 'Micellar Water 400ml', channel: 'lazada', revenue: 124_000_000, netProfit: 12_400_000, marginPct: 10.0, volume: 2480, inventory: 920, classification: 'illusion_bestseller', riskFlag: false },
  { id: 'sk-18', name: 'Lip Balm 4pcs', channel: 'shopee', revenue: 67_000_000, netProfit: 20_100_000, marginPct: 30.0, volume: 3350, inventory: 1100, classification: 'neutral', riskFlag: false },
  { id: 'sk-19', name: 'Exfoliator 100ml', channel: 'shopify', revenue: 44_000_000, netProfit: 13_200_000, marginPct: 30.0, volume: 880, inventory: 200, classification: 'neutral', riskFlag: false },
  { id: 'sk-20', name: 'Gift Set Luxury', channel: 'tiktok', revenue: 156_000_000, netProfit: -9_360_000, marginPct: -6.0, volume: 312, inventory: 95, classification: 'cash_burner', riskFlag: true },
]

// ——— Campaigns ———
export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Summer Glow Sale', channel: 'shopee', spend: 45_000_000, revenue: 189_000_000, roas: 4.2, status: 'active' },
  { id: 'c2', name: 'TikTok Live Week', channel: 'tiktok', spend: 28_000_000, revenue: 67_200_000, roas: 2.4, status: 'active' },
  { id: 'c3', name: 'Flash Sale Tokopedia', channel: 'tokopedia', spend: 32_000_000, revenue: 128_000_000, roas: 4.0, status: 'ended' },
  { id: 'c4', name: 'Lazada 3.3', channel: 'lazada', spend: 38_000_000, revenue: 152_000_000, roas: 4.0, status: 'active' },
  { id: 'c5', name: 'Brand Awareness Q1', channel: 'tiktok', spend: 55_000_000, revenue: 82_500_000, roas: 1.5, status: 'active' },
  { id: 'c6', name: 'Shopify D2C Push', channel: 'shopify', spend: 12_000_000, revenue: 48_000_000, roas: 4.0, status: 'active' },
  { id: 'c7', name: 'Shopee 2.2', channel: 'shopee', spend: 52_000_000, revenue: 208_000_000, roas: 4.0, status: 'ended' },
  { id: 'c8', name: 'Influencer Collab', channel: 'tiktok', spend: 25_000_000, revenue: 75_000_000, roas: 3.0, status: 'paused' },
  { id: 'c9', name: 'Tokopedia 12.12', channel: 'tokopedia', spend: 60_000_000, revenue: 240_000_000, roas: 4.0, status: 'ended' },
  { id: 'c10', name: 'New Launch Serum', channel: 'shopee', spend: 18_000_000, revenue: 72_000_000, roas: 4.0, status: 'active' },
]

export interface AIInsight {
  en: AIInsightContent
  id: AIInsightContent
}

// ——— AI insights ———
export const aiInsight: AIInsight = {
  en: {
    executiveSummary: 'Revenue is up 12% WoW with margin improvement of 2.3pp. Shopee and Tokopedia drive 64% of revenue. Three cash-burner SKUs require immediate repricing or pause. TikTok ROAS on "Brand Awareness Q1" is below target.',
    topRisks: [
      'Premium Box Set has negative margin (-13%) across channels; consider discontinuing or repricing.',
      'Cleanser Gentle 100ml margin dropped to 10% on Shopee; high volume but low profitability.',
      'Trial Set 3pcs and Mask Sheet 5pcs are loss leaders; review promo depth and inventory.',
    ],
    topOpportunities: [
      'Face Mist Rose and Eye Cream 15ml show 30% margin with growing volume; scale inventory.',
      'Shopify D2C has highest margin (21.2%); allocate more budget to direct channel.',
      'Lip Tint Set and Sunscreen SPF50 are stars with strong sell-through; consider bundling.',
    ],
    actionPriorities: [
      'Pause or reprice Premium Box Set and Gift Set Luxury within 48 hours.',
      'Increase safety stock for Face Mist Rose and Hair Serum 50ml (hidden gems).',
      'Reduce TikTok "Brand Awareness Q1" spend or tighten targeting to improve ROAS.',
      'Run margin audit on all illusion bestsellers (Cleanser, Toner, BB Cream, Micellar Water).',
      'Plan Shopee 3.3 campaign with focus on star SKUs and limited cash-burner exposure.',
    ],
    strategicObservation: 'Portfolio is shifting toward higher-margin D2C and Tokopedia. TikTok is acquisition-heavy; consider dedicated retention campaigns. Inventory pressure (62) is moderate—watch Mask Sheet and Trial Set overstock.',
  },
  id: {
    executiveSummary: 'Pendapatan naik 12% WoW dengan peningkatan margin sebesar 2.3pp. Shopee dan Tokopedia menyumbang 64% dari total pendapatan. Tiga SKU kategori "Cash Burner" memerlukan penyesuaian harga segera atau dihentikan sementara. ROAS TikTok pada kampanye "Brand Awareness Q1" masih di bawah target.',
    topRisks: [
      'Premium Box Set memiliki margin negatif (-13%) di semua kanal; pertimbangkan untuk menghentikan atau menyesuaikan harga.',
      'Margin Cleanser Gentle 100ml turun menjadi 10% di Shopee; volume tinggi namun profitabilitas rendah.',
      'Trial Set 3pcs dan Mask Sheet 5pcs adalah produk yang merugi; tinjau kedalaman promo dan stok inventaris.',
    ],
    topOpportunities: [
      'Face Mist Rose dan Eye Cream 15ml menunjukkan margin 30% dengan volume yang terus meningkat; tingkatkan stok.',
      'Shopify D2C memiliki margin tertinggi (21,2%); alokasikan lebih banyak anggaran ke kanal langsung.',
      'Lip Tint Set dan Sunscreen SPF50 adalah produk unggulan dengan tingkat penjualan tinggi; pertimbangkan skema bundling.',
    ],
    actionPriorities: [
      'Hentikan sementara atau sesuaikan harga Premium Box Set dan Gift Set Luxury dalam waktu 48 jam.',
      'Tingkatkan stok pengaman untuk Face Mist Rose dan Hair Serum 50ml (Hidden Gem).',
      'Kurangi pengeluaran TikTok "Brand Awareness Q1" atau pertegas target audiens untuk meningkatkan ROAS.',
      'Lakukan audit margin pada semua produk best-seller semu (Cleanser, Toner, BB Cream, Micellar Water).',
      'Rencanakan kampanye Shopee 3.3 dengan fokus pada SKU bintang dan batasi eksposur produk rugi.',
    ],
    strategicObservation: 'Portofolio bergeser ke arah D2C dan Tokopedia dengan margin lebih tinggi. TikTok sangat bergantung pada akuisisi; pertimbangkan kampanye retensi khusus. Tekanan inventaris (62) berada di level moderat—pantau stok berlebih pada Mask Sheet dan Trial Set.',
  },
}

// ——— Helpers ———
export function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace(/\s/g, ' ')
}

/**
 * Formats a number as IDR (Indonesian Rupiah) with smart abbreviations.
 * >= 1.000.000.000 -> "Rp X.Xmiliar" 
 * >= 1.000.000 -> "Rp XXX jt"
 * < 1.000.000 -> "Rp X.XXX"
 */
export function formatIDRShort(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${sign}Rp ${(absValue / 1_000_000_000).toFixed(1)}miliar`;
  } else if (absValue >= 1_000_000) {
    return `${sign}Rp ${Math.floor(absValue / 1_000_000)} jt`;
  } else {
    return `${sign}Rp ${absValue.toLocaleString('id-ID')}`;
  }
}
