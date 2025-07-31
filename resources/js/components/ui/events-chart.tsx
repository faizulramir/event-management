import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { router } from '@inertiajs/react';

interface ChartDataPoint {
  date: string;
  count: number;
  formattedDate: string;
}

interface EventsChartProps {
  data: ChartDataPoint[];
  statusOptions: Record<string, string>;
  currentStatusFilter?: string;
  periodOptions: Array<{ value: string; label: string }>;
  currentPeriod: string;
}

export default function EventsChart({ 
  data, 
  statusOptions, 
  currentStatusFilter,
  periodOptions,
  currentPeriod
}: EventsChartProps) {
  const handleStatusFilterChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (value === 'all') {
      params.delete('status_filter');
    } else {
      params.set('status_filter', value);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    
    router.visit(url, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('period', value);
    
    const queryString = params.toString();
    const url = `${window.location.pathname}?${queryString}`;
    
    router.visit(url, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            Events: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <CardTitle>Events Registration Trend</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Period:</span>
            <Select 
              value={currentPeriod} 
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select 
              value={currentStatusFilter || 'all'} 
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="formattedDate" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground flex-shrink-0">
          Showing events registered in the {periodOptions.find(p => p.value === currentPeriod)?.label.toLowerCase() || 'selected period'}
          {currentStatusFilter && (
            <span className="ml-1">
              (filtered by: {statusOptions[currentStatusFilter]})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}