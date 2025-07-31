"use client"

import * as React from "react"
import { router } from "@inertiajs/react"
import { Link } from "@inertiajs/react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface PaginationData {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

export interface FilterOption {
    label: string
    value: string
}

export interface FilterConfig {
    key: string
    label: string
    options: FilterOption[]
    placeholder?: string
    disabled?: boolean
}

export interface ColumnConfig<T> {
    key: keyof T | string
    label: string
    sortable?: boolean
    searchable?: boolean
    render?: (item: T, value: any) => React.ReactNode
    mobileRender?: (item: T, value: any) => React.ReactNode
    className?: string
}

export interface MobileCardConfig<T> {
    title: (item: T) => React.ReactNode
    subtitle?: (item: T) => React.ReactNode
    badge?: (item: T) => React.ReactNode
    content: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: ColumnConfig<T>[]
    pagination: PaginationData
    filters?: Record<string, any>
    filterConfigs?: FilterConfig[]
    searchConfig?: {
        enabled: boolean
        placeholder?: string
        searchableColumns?: (keyof T)[]
    }
    mobileCardConfig?: MobileCardConfig<T>
    emptyMessage?: string
    className?: string
    onRowClick?: (item: T) => void
    actionsConfig?: {
        render: (item: T) => React.ReactNode
        mobileRender?: (item: T) => React.ReactNode
    }
}

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    pagination,
    filters = {},
    filterConfigs = [],
    searchConfig = { enabled: true },
    mobileCardConfig,
    emptyMessage,
    className = "",
    onRowClick,
    actionsConfig,
}: DataTableProps<T>) {

    // Set default values with translations
    const defaultSearchPlaceholder = searchConfig.placeholder || "Search"
    const defaultEmptyMessage = emptyMessage || "No data"

    // Get current URL parameters to ensure UI stays in sync
    const getCurrentUrlParams = () => {
        if (typeof window === "undefined") return {}
        const params = new URLSearchParams(window.location.search)
        const urlParams: Record<string, string> = {}
        params.forEach((value, key) => {
            urlParams[key] = value
        })
        return urlParams
    }

    const currentUrlParams = getCurrentUrlParams()
    const [searchValue, setSearchValue] = React.useState(filters.search || "")
    const [isSearching, setIsSearching] = React.useState(false)
    const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
    const previousSearchRef = React.useRef<string>(filters.search || "")

    // Debounced search
    const debouncedSearch = React.useCallback(
        (query: string) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }

            searchTimeoutRef.current = setTimeout(() => {
                if (query !== previousSearchRef.current) {
                    setIsSearching(true)
                    // Preserve all current filters when searching
                    const currentParams = new URLSearchParams(window.location.search)
                    const preservedFilters: Record<string, string> = {}

                    // Keep all existing filter parameters
                    filterConfigs.forEach((config) => {
                        const value = currentParams.get(config.key)
                        if (value && value !== "all") {
                            preservedFilters[config.key] = value
                        }
                    })

                    // Keep other non-filter parameters except page
                    currentParams.forEach((value, key) => {
                        if (key !== "search" && key !== "page" && key !== "per_page") {
                            preservedFilters[key] = value
                        }
                    })

                    router.get(
                        window.location.pathname,
                        {
                            ...preservedFilters,
                            search: query || undefined, // Don't include empty search
                            per_page: filters.per_page || pagination.per_page,
                            page: 1,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            onFinish: () => setIsSearching(false),
                        },
                    )
                    previousSearchRef.current = query
                }
            }, 300)
        },
        [filterConfigs, filters.per_page, pagination.per_page],
    )

    React.useEffect(() => {
        if (!searchConfig.enabled) return

        debouncedSearch(searchValue)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchValue, debouncedSearch, searchConfig.enabled])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    React.useEffect(() => {
        if (filters.search !== searchValue) {
            setSearchValue(filters.search || "")
            previousSearchRef.current = filters.search || ""
        }
    }, [filters.search])

    const handleFilterChange = (key: string, value: string) => {
        // Preserve current search and other filters
        const currentParams = new URLSearchParams(window.location.search)
        const preservedParams: Record<string, string> = {}

        // Keep current search
        if (searchValue) {
            preservedParams.search = searchValue
        }

        // Keep all other filters except the one being changed
        filterConfigs.forEach((config) => {
            if (config.key !== key) {
                const existingValue = currentParams.get(config.key)
                if (existingValue && existingValue !== "all") {
                    preservedParams[config.key] = existingValue
                }
            }
        })

        // Keep other non-filter parameters
        currentParams.forEach((paramValue, paramKey) => {
            if (
                paramKey !== "search" &&
                paramKey !== "page" &&
                paramKey !== "per_page" &&
                !filterConfigs.some((config) => config.key === paramKey)
            ) {
                preservedParams[paramKey] = paramValue
            }
        })

        // Add the new filter value (only if not "all" or empty)
        if (value && value !== "all") {
            preservedParams[key] = value
        }

        router.get(
            window.location.pathname,
            {
                ...preservedParams,
                per_page: filters.per_page || pagination.per_page,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    const clearFilters = () => {
        setSearchValue("")
        previousSearchRef.current = ""
        router.get(
            window.location.pathname,
            {
                per_page: filters.per_page || pagination.per_page,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    const clearSearch = () => {
        setSearchValue("")
        previousSearchRef.current = ""

        // Preserve all current filters when clearing search
        const currentParams = new URLSearchParams(window.location.search)
        const preservedFilters: Record<string, string> = {}

        filterConfigs.forEach((config) => {
            const value = currentParams.get(config.key)
            if (value && value !== "all") {
                preservedFilters[config.key] = value
            }
        })

        // Keep other non-search parameters
        currentParams.forEach((value, key) => {
            if (key !== "search" && key !== "page") {
                preservedFilters[key] = value
            }
        })

        router.get(
            window.location.pathname,
            {
                ...preservedFilters,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    const getNestedValue = (obj: T, path: string): any => {
        return path.split(".").reduce((current, key) => current?.[key], obj)
    }

    const hasActiveFilters = Object.keys({ ...filters, ...currentUrlParams }).some(
        (key) => key !== "page" && key !== "per_page" && (filters[key] || currentUrlParams[key]),
    )

    const handleRowClick = (item: T, event: React.MouseEvent) => {
        // Don't trigger row click if clicking on action buttons or their children
        const target = event.target as HTMLElement
        if (target.closest("[data-action-button]")) {
            return
        }
        onRowClick?.(item)
    }

    const renderMobileCard = (item: T, index: number) => {
        if (mobileCardConfig) {
            return (
                <Card
                    key={index}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={(e) => handleRowClick(item, e)}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{mobileCardConfig.title(item)}</CardTitle>
                            {mobileCardConfig.badge && mobileCardConfig.badge(item)}
                        </div>
                        {mobileCardConfig.subtitle && (
                            <div className="text-sm text-muted-foreground">{mobileCardConfig.subtitle(item)}</div>
                        )}
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                        {mobileCardConfig.content(item)}
                        {actionsConfig && (
                            <div className="pt-2 border-t" data-action-button>
                                {actionsConfig.mobileRender ? actionsConfig.mobileRender(item) : actionsConfig.render(item)}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )
        }

        // Default mobile card layout
        return (
            <Card
                key={index}
                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={(e) => handleRowClick(item, e)}
            >
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        {columns.slice(0, 4).map((column, colIndex) => {
                            const value = getNestedValue(item, column.key as string)
                            return (
                                <div key={colIndex} className="flex justify-between text-sm">
                                    <span className="font-medium">{column.label}:</span>
                                    <span>
                                        {column.mobileRender
                                            ? column.mobileRender(item, value)
                                            : column.render
                                                ? column.render(item, value)
                                                : String(value || "")}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    {actionsConfig && (
                        <div className="pt-2 border-t" data-action-button>
                            {actionsConfig.mobileRender ? actionsConfig.mobileRender(item) : actionsConfig.render(item)}
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    const handlePageSizeChange = (value: string) => {
        const currentParams = new URLSearchParams(window.location.search)
        const preservedParams: Record<string, string> = {}

        // Keep current search and other filters
        if (searchValue) {
            preservedParams.search = searchValue
        }

        // Keep all other filters
        filterConfigs.forEach((config) => {
            const existingValue = currentParams.get(config.key)
            if (existingValue && existingValue !== "all") {
                preservedParams[config.key] = existingValue
            }
        })

        // Keep other non-filter parameters
        currentParams.forEach((paramValue, paramKey) => {
            if (paramKey !== "search" && paramKey !== "page" && paramKey !== "per_page") {
                preservedParams[paramKey] = paramValue
            }
        })

        router.get(
            window.location.pathname,
            {
                ...preservedParams,
                per_page: Number.parseInt(value),
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search and Filters */}
            {(searchConfig.enabled || filterConfigs.length > 0) && (
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    {searchConfig.enabled && (
                        <div className="relative w-full md:max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={defaultSearchPlaceholder}
                                value={searchValue}
                                onChange={handleSearchChange}
                                className="pl-10 pr-10"
                            />
                            {searchValue && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
                                    onClick={clearSearch}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                            {isSearching && (
                                <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                            )}
                        </div>
                    )}

                    {/* Filters */}
                    {filterConfigs.length > 0 && (
                        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap">
                            {filterConfigs.map((filterConfig) => (
                                <Select
                                    key={filterConfig.key}
                                    value={currentUrlParams[filterConfig.key] || filters[filterConfig.key] || "all"}
                                    onValueChange={(value) => handleFilterChange(filterConfig.key, value)}
                                    disabled={filterConfig.disabled}
                                >
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder={filterConfig.placeholder || filterConfig.label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All {filterConfig.label}</SelectItem>
                                        {filterConfig.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ))}

                            {hasActiveFilters && (
                                <Button variant="ghost" onClick={clearFilters} className="h-10 px-2 lg:px-3 w-full md:w-auto">
                                    Clear
                                    <X className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {/* Search Badge */}
                    {searchValue && (
                        <Badge variant="secondary">
                            Search: {searchValue}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                                onClick={clearSearch}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}

                    {/* Filter Badges */}
                    {Object.entries({ ...filters, ...currentUrlParams }).map(([key, value]) => {
                        if (!value || key === "page" || key === "per_page" || key === "search") return null

                        const filterConfig = filterConfigs.find((f) => f.key === key)
                        if (!filterConfig) return null // Only show configured filters

                        const displayValue = filterConfig?.options.find((o) => o.value === value)?.label || value

                        return (
                            <Badge key={key} variant="secondary">
                                {filterConfig?.label || key}: {displayValue}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleFilterChange(key, "")}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )
                    })}
                </div>
            )}

            {/* Mobile Card View */}
            <div className="block md:hidden">
                <div className="space-y-4">
                    {data.length > 0 ? (
                        data.map((item, index) => renderMobileCard(item, index))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">{defaultEmptyMessage}</div>
                    )}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead key={index} className={column.className}>
                                        {column.label}
                                    </TableHead>
                                ))}
                                {actionsConfig && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        className={onRowClick ? "cursor-pointer" : ""}
                                        onClick={(e) => handleRowClick(item, e)}
                                    >
                                        {columns.map((column, colIndex) => {
                                            const value = getNestedValue(item, column.key as string)
                                            return (
                                                <TableCell key={colIndex} className={column.className}>
                                                    {column.render ? column.render(item, value) : String(value || "")}
                                                </TableCell>
                                            )
                                        })}
                                        {actionsConfig && (
                                            <TableCell className="text-right" data-action-button>
                                                {actionsConfig.render(item)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + (actionsConfig ? 1 : 0)} className="h-24 text-center">
                                        {defaultEmptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-muted-foreground order-2 md:order-1 text-center md:text-left">
                    Showing results {pagination.from || 0} to {pagination.to || 0} of {pagination.total}
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 order-1 md:order-2">
                    {/* Page Size Selector */}
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select value={`${pagination.per_page}`} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={pagination.per_page} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Page Info */}
                    <div className="flex items-center justify-center text-sm font-medium">
                        Page {pagination.current_page} of {pagination.last_page}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-1">
                        {pagination.current_page === 1 ? (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                disabled={true}
                                aria-label="Go to first page"
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Link
                                href={`?${new URLSearchParams({
                                    ...getCurrentUrlParams(),
                                    page: "1",
                                }).toString()}`}
                                preserveState
                                preserveScroll
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    aria-label="Go to first page"
                                >
                                    <span className="sr-only">Go to first page</span>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}

                        {pagination.current_page === 1 ? (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                disabled={true}
                                aria-label="Go to previous page"
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Link
                                href={`?${new URLSearchParams({
                                    ...getCurrentUrlParams(),
                                    page: String(pagination.current_page - 1),
                                }).toString()}`}
                                preserveState
                                preserveScroll
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    aria-label="Go to previous page"
                                >
                                    <span className="sr-only">Go to previous page</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}

                        {pagination.current_page === pagination.last_page ? (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                disabled={true}
                                aria-label="Go to next page"
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Link
                                href={`?${new URLSearchParams({
                                    ...getCurrentUrlParams(),
                                    page: String(pagination.current_page + 1),
                                }).toString()}`}
                                preserveState
                                preserveScroll
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    aria-label="Go to next page"
                                >
                                    <span className="sr-only">Go to next page</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}

                        {pagination.current_page === pagination.last_page ? (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                disabled={true}
                                aria-label="Go to last page"
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Link
                                href={`?${new URLSearchParams({
                                    ...getCurrentUrlParams(),
                                    page: String(pagination.last_page),
                                }).toString()}`}
                                preserveState
                                preserveScroll
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    aria-label="Go to last page"
                                >
                                    <span className="sr-only">Go to last page</span>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
