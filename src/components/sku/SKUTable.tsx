import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ChevronRight, ChevronLeft, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatIDRShort } from '@/data/mockData'
import type { SKU, SKUClassification } from '@/data/mockData'
import { useAppStore } from '@/store/useAppStore'

const CLASSIFICATION_MAP: Record<SKUClassification, { label: string; className: string; icon: string }> = {
  star: {
    label: 'Star',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-400 border-yellow-300/50 dark:border-yellow-500/20',
    icon: '⭐'
  },
  hidden_gem: {
    label: 'Gem',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-400 border-purple-300/50 dark:border-purple-500/20',
    icon: '💎'
  },
  illusion_bestseller: {
    label: 'Illusion',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-400 border-orange-300/50 dark:border-orange-500/20',
    icon: '🎭'
  },
  cash_burner: {
    label: 'Burner',
    className: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400 border-red-300/50 dark:border-red-500/20',
    icon: '🔥'
  },
  neutral: {
    label: 'Neutral',
    className: 'bg-gray-100 text-[var(--text-secondary)] dark:bg-white/5 dark:text-gray-400 border-[var(--border)] dark:border-white/10',
    icon: '•'
  },
}

const CHANNEL_STYLING: Record<string, string> = {
  tiktok: 'bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/20',
  shopify: 'bg-[#96BF48]/10 text-[#96BF48] border-[#96BF48]/20',
  shopee: 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20',
  tokopedia: 'bg-[#42B549]/10 text-[#42B549] border-[#42B549]/20',
  lazada: 'bg-[#0F146D]/10 text-[#0F146D] border-[#0F146D]/20',
}

interface SKUTableProps {
  data: SKU[]
  maxRows?: number
  className?: string
}

export function SKUTable({ data, className }: SKUTableProps) {
  const { t } = useAppStore()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'revenue', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<SKU>[]>(() => [
    {
      accessorKey: 'name',
      header: t('skuName'),
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-col py-1 overflow-hidden">
          <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight tracking-tight group-hover:text-blue-500 transition-colors truncate">
            {(row.original as SKU).name}
          </span>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5 hidden lg:block">
            {(row.original as SKU).id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }: { row: any }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-tighter",
          CHANNEL_STYLING[(row.original as SKU).channel] || "bg-gray-100 text-gray-600 border-gray-200"
        )}>
          {(row.original as SKU).channel}
        </span>
      ),
    },
    {
      accessorKey: 'revenue',
      header: () => <div className="text-right">{t('revenue')}</div>,
      cell: ({ row }: { row: any }) => (
        <div className="text-right font-bold tabular-nums text-[var(--text-primary)]">
          {formatIDRShort((row.original as SKU).revenue)}
        </div>
      ),
    },
    {
      accessorKey: 'netProfit',
      header: () => <div className="text-right">{t('netProfit')}</div>,
      cell: ({ row }: { row: any }) => {
        const profit = (row.original as SKU).netProfit
        return (
          <div className={cn(
            "text-right font-mono text-sm tabular-nums font-bold",
            profit >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {formatIDRShort(profit)}
          </div>
        )
      },
    },
    {
      accessorKey: 'marginPct',
      header: () => <div className="text-right">{t('margin')} %</div>,
      cell: ({ row }: { row: any }) => {
        const margin = (row.original as SKU).marginPct
        return (
          <div className={cn(
            "text-right font-mono text-sm tabular-nums",
            margin > 20 ? "text-emerald-500 font-semibold" :
              margin >= 10 ? "text-blue-400" :
                margin >= 5 ? "text-amber-400" : "text-red-400 font-semibold"
          )}>
            {margin}%
          </div>
        )
      },
    },
    {
      accessorKey: 'classification',
      header: t('classification'),
      cell: ({ row }: { row: any }) => {
        const meta = CLASSIFICATION_MAP[(row.original as SKU).classification as SKUClassification] || CLASSIFICATION_MAP.neutral
        return (
          <div className="flex justify-start">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold border whitespace-nowrap",
              meta.className
            )}>
              <span className="text-[12px]">{meta.icon}</span> {meta.label}
            </span>
          </div>
        )
      },
    },
  ], [t])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className={cn('space-y-4', className)}>
      {/* Table Header / Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={t('searchSku')}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest bg-[var(--bg-tertiary)] px-3 py-1 rounded-full border border-[var(--border)]">
          {t('showing')} <span className="text-[var(--text-primary)]">{table.getRowModel().rows.length}</span> {t('of')} <span className="text-[var(--text-primary)]">{data.length}</span> {t('skus')}
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="glass-card border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="min-w-[600px] md:min-w-full">
            {/* Header Row - Unified Grid */}
            <div className="grid grid-cols-[1.5fr_100px_100px_100px_80px_120px] md:grid-cols-[2fr_120px_120px_120px_100px_140px] border-b border-[var(--border)] bg-[var(--bg-tertiary)]/50 px-4 h-12">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => {
                  const isMobileHidden = ['revenue', 'netProfit'].includes(header.id)
                  return (
                    <div
                      key={header.id}
                      className={cn(
                        "text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold flex items-center gap-1 select-none transition-colors",
                        header.column.getCanSort() && "cursor-pointer hover:text-[var(--text-primary)] group",
                        isMobileHidden && "hidden md:flex"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {{
                            asc: <ArrowUp className="h-3 w-3 text-primary" />,
                            desc: <ArrowDown className="h-3 w-3 text-primary" />,
                          }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-3 w-3" />}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-border/50">
              {table.getRowModel().rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-background/50">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <div className="h-12 w-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg" />
                  </div>
                  <p className="text-sm text-gray-400">No SKUs found</p>
                </div>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <div
                    key={row.id}
                    className={cn(
                      "grid grid-cols-[1.5fr_100px_100px_100px_80px_120px] md:grid-cols-[2fr_120px_120px_120px_100px_140px] px-4 items-center transition-all duration-150 cursor-pointer hover:bg-[var(--bg-tertiary)] h-14",
                      row.original.marginPct < 0 && "bg-red-500/[0.03] dark:bg-red-500/[0.05]"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isMobileHidden = ['revenue', 'netProfit'].includes(cell.column.id)
                      return (
                        <div key={cell.id} className={cn(isMobileHidden && "hidden md:block")}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Page</span>
          <span className="text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-md border border-[var(--border)]">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">of {table.getPageCount()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
