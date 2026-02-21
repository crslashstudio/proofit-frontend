import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { ChevronRight, ChevronLeft, AlertTriangle, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatIDRShort } from '@/data/mockData'
import type { SKU, SKUClassification } from '@/data/mockData'

const CLASSIFICATION_MAP: Record<SKUClassification, { label: string; className: string; icon: string }> = {
  star: {
    label: 'Star',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-500/20',
    icon: '⭐'
  },
  hidden_gem: {
    label: 'Hidden Gem',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20',
    icon: '💎'
  },
  illusion_bestseller: {
    label: 'Illusion Bestseller',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400 border-orange-200/50 dark:border-orange-500/20',
    icon: '🎭'
  },
  cash_burner: {
    label: 'Cash Burner',
    className: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-200/50 dark:border-red-500/20',
    icon: '🔥'
  },
  neutral: {
    label: 'Neutral',
    className: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border-gray-200/50 dark:border-white/10',
    icon: '•'
  },
}

const CHANNEL_STYLING: Record<string, string> = {
  tiktok: 'bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/20',
  shopee: 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20',
  tokopedia: 'bg-[#42B549]/10 text-[#42B549] border-[#42B549]/20',
  lazada: 'bg-[#0F146D]/10 text-[#0F146D] border-[#0F146D]/20',
  shopify: 'bg-[#96BF48]/10 text-[#96BF48] border-[#96BF48]/20',
}

interface SKUTableProps {
  data: SKU[]
  maxRows?: number
  className?: string
}

export function SKUTable({ data, className }: SKUTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'revenue', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<SKU>[]>(() => [
    {
      accessorKey: 'name',
      header: 'SKU Name',
      cell: ({ row }) => (
        <span className="font-medium text-sm truncate block text-foreground" title={row.original.name}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => {
        const channel = row.original.channel
        return (
          <span className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
            CHANNEL_STYLING[channel] || "bg-gray-100 text-gray-600 border-gray-200"
          )}>
            {channel}
          </span>
        )
      },
    },
    {
      accessorKey: 'revenue',
      header: () => <div className="text-right">Revenue</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm tabular-nums text-foreground">
          {formatIDRShort(row.original.revenue)}
        </div>
      ),
    },
    {
      accessorKey: 'netProfit',
      header: () => <div className="text-right">Net Profit</div>,
      cell: ({ row }) => {
        const profit = row.original.netProfit
        return (
          <div className={cn(
            "text-right font-mono text-sm tabular-nums",
            profit >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {formatIDRShort(profit)}
          </div>
        )
      },
    },
    {
      accessorKey: 'marginPct',
      header: () => <div className="text-right">Margin %</div>,
      cell: ({ row }) => {
        const margin = row.original.marginPct
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
      header: 'Classification',
      cell: ({ row }) => {
        const meta = CLASSIFICATION_MAP[row.original.classification]
        return (
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold border",
            meta.className
          )}>
            {meta.icon} {meta.label}
          </span>
        )
      },
    },
    {
      accessorKey: 'riskFlag',
      header: () => <div className="text-center">Risk</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.riskFlag && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </div>
      ),
    },
  ], [])

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
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search SKUs..."
            className="w-full rounded-xl border border-border bg-transparent pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="text-xs text-gray-400 font-medium">
          Showing <span className="text-foreground">{table.getRowModel().rows.length}</span> of <span className="text-foreground">{data.length}</span> SKUs
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="glass-card border-border overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-[minmax(200px,2fr)_100px_120px_120px_100px_160px_60px] border-b border-border bg-gray-50/80 dark:bg-white/[0.02] px-4 py-3">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center gap-2 select-none transition-colors",
                    header.column.getCanSort() && "cursor-pointer hover:text-foreground group"
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
              ))
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
                    "grid grid-cols-[minmax(200px,2fr)_100px_120px_120px_100px_160px_60px] px-4 py-3 items-center transition-all duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]",
                    row.original.marginPct < 0 && "bg-red-50/80 dark:bg-red-500/[0.04] border-l-2 border-red-400"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Page</span>
          <span className="text-xs font-bold text-foreground">
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
