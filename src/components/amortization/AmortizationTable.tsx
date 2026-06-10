import { useState, useMemo } from 'react';
import { Table as TableIcon, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionCard } from '@/components/shared';
import { formatCurrency } from '@/utils/currency';
import { exportToCSV, calculateScheduleSummary } from './exportUtils';
import type { AmortizationRow } from '@/types/loan';

/**
 * Props for AmortizationTable component
 */
export interface AmortizationTableProps {
  /** Amortization schedule data */
  schedule: AmortizationRow[];
  /** Current month to highlight (optional) */
  currentMonth?: number;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Display detailed month-by-month loan repayment schedule
 * 
 * Features:
 * - Sticky header that stays visible while scrolling
 * - Pagination with configurable page size
 * - Search/filter by month number
 * - Sort by any column
 * - Export to CSV functionality
 * - Responsive design with horizontal scroll on mobile
 * - Alternating row colors for readability
 * - Highlight current month
 * - Summary row showing totals
 * 
 * @example
 * ```tsx
 * <AmortizationTable
 *   schedule={amortizationSchedule}
 *   currentMonth={12}
 * />
 * ```
 */
export function AmortizationTable({
  schedule,
  currentMonth,
  isLoading = false,
}: AmortizationTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortColumn, setSortColumn] = useState<keyof AmortizationRow | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter schedule based on search term
  const filteredSchedule = useMemo(() => {
    if (!searchTerm) return schedule;
    
    const searchNumber = parseInt(searchTerm, 10);
    if (isNaN(searchNumber)) return schedule;
    
    return schedule.filter((row) => 
      row.month.toString().includes(searchTerm)
    );
  }, [schedule, searchTerm]);

  // Sort schedule if sort column is set
  const sortedSchedule = useMemo(() => {
    if (!sortColumn) return filteredSchedule;
    
    return [...filteredSchedule].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredSchedule, sortColumn, sortDirection]);

  // Paginate schedule
  const paginatedSchedule = useMemo(() => {
    if (pageSize === -1) return sortedSchedule; // Show all
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedSchedule.slice(startIndex, endIndex);
  }, [sortedSchedule, currentPage, pageSize]);

  // Calculate pagination info
  const totalPages = useMemo(() => {
    if (pageSize === -1) return 1;
    return Math.ceil(sortedSchedule.length / pageSize);
  }, [sortedSchedule.length, pageSize]);

  const startEntry = useMemo(() => {
    if (pageSize === -1) return 1;
    return (currentPage - 1) * pageSize + 1;
  }, [currentPage, pageSize]);

  const endEntry = useMemo(() => {
    if (pageSize === -1) return sortedSchedule.length;
    return Math.min(currentPage * pageSize, sortedSchedule.length);
  }, [currentPage, pageSize, sortedSchedule.length]);

  // Calculate totals
  const totals = useMemo(() => {
    return calculateScheduleSummary(schedule);
  }, [schedule]);

  // Handle export
  const handleExport = () => {
    const filename = `loan-amortization-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(schedule, filename);
  };

  // Handle sort
  const handleSort = (column: keyof AmortizationRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = value === 'all' ? -1 : parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <SectionCard
        title="Amortization Schedule"
        description="Month-by-month loan repayment breakdown"
        icon={TableIcon}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </SectionCard>
    );
  }

  if (schedule.length === 0) {
    return (
      <SectionCard
        title="Amortization Schedule"
        description="Month-by-month loan repayment breakdown"
        icon={TableIcon}
      >
        <div className="text-center py-12 text-muted-foreground">
          No amortization data available. Please calculate loan details first.
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Amortization Schedule"
      description="Month-by-month loan repayment breakdown"
      icon={TableIcon}
    >
      {/* Search and Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('month')}
                >
                  <div className="flex items-center gap-1">
                    Month
                    {sortColumn === 'month' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('emi')}
                >
                  <div className="flex items-center justify-end gap-1">
                    EMI
                    {sortColumn === 'emi' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('principal')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Principal
                    {sortColumn === 'principal' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('interest')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Interest
                    {sortColumn === 'interest' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('balance')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Balance
                    {sortColumn === 'balance' && (
                      <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSchedule.map((row, index) => (
                <TableRow
                  key={row.month}
                  className={`
                    ${row.month === currentMonth ? 'bg-primary/10 font-medium' : ''}
                    ${index % 2 === 0 ? 'bg-muted/30' : ''}
                    hover:bg-muted/50 transition-colors
                  `}
                >
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(row.emi)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(row.principal)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(row.interest)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(row.balance)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Totals Row */}
              <TableRow className="font-bold border-t-2 bg-muted hover:bg-muted">
                <TableCell>Total</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(totals.totalEMI)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(totals.totalPrincipal)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(totals.totalInterest)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={pageSize === -1 ? 'all' : pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="60">60</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {startEntry}-{endEntry} of {sortedSchedule.length} entries
          </span>
        </div>

        {pageSize !== -1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// Made with Bob